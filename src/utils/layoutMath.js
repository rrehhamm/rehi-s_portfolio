// Pure layout math for the dynamic desktop: widget clamping, collision
// detection, and grid-based icon placement. No React here on purpose —
// keeps it trivially testable and reusable from the context and the drag hook.

// The icon's real visible container (glyph + label), used for every
// collision check and for clamping during drag. Kept deliberately close to
// the actual rendered size in DesktopIcon.css so the invisible collision box
// matches what the user sees — this is what lets two icons sit right next
// to each other instead of being rejected by a phantom oversized hitbox.
export const ICON_BOX_WIDTH = 72;
export const ICON_BOX_HEIGHT = 88;
export const ICON_BOX_SIZE = { width: ICON_BOX_WIDTH, height: ICON_BOX_HEIGHT };

// Small safety margin added around collision boxes (icon-vs-icon,
// icon-vs-widget) — intentionally small so adjacent placements aren't
// rejected just for being close.
export const ICON_COLLISION_MARGIN = 6;

// Step size of the invisible grid used only for (a) the automatic default
// layout and (b) snapping a dropped icon to a tidy nearby cell when it
// actually overlaps something. Icon box + a small gap, so two adjacent grid
// cells never overlap by construction.
const ICON_GRID_GAP = 10;
export const GRID_CELL_WIDTH = ICON_BOX_WIDTH + ICON_GRID_GAP;
export const GRID_CELL_HEIGHT = ICON_BOX_HEIGHT + ICON_GRID_GAP;
const CELL_PADDING = 6;

// Mirrors --menubar-height / --dock-height in variables.css. Kept as plain
// constants here since this module can't read CSS custom properties.
export const MENUBAR_HEIGHT = 30;
export const DOCK_EXCLUSION_HEIGHT = 108; // dock height + its bottom margin + breathing room

/** Usable desktop rectangle — below the menu bar, above the Dock. */
export function getDesktopBounds(viewportWidth, viewportHeight) {
  return {
    left: 16,
    top: MENUBAR_HEIGHT + 12,
    right: Math.max(viewportWidth - 16, 16 + 100),
    bottom: Math.max(viewportHeight - DOCK_EXCLUSION_HEIGHT, MENUBAR_HEIGHT + 12 + 100),
  };
}

export function rectFrom(position, size) {
  return { left: position.x, top: position.y, right: position.x + size.width, bottom: position.y + size.height };
}

export function rectsOverlap(a, b, padding = 0) {
  return (
    a.left - padding < b.right + padding &&
    a.right + padding > b.left - padding &&
    a.top - padding < b.bottom + padding &&
    a.bottom + padding > b.top - padding
  );
}

/** Keeps a widget's rect fully inside the desktop bounds (never under the menu bar or Dock, never off-screen). */
export function clampWidgetToDesktop(position, size, bounds) {
  const maxX = Math.max(bounds.right - size.width, bounds.left);
  const maxY = Math.max(bounds.bottom - size.height, bounds.top);
  return {
    x: Math.min(Math.max(position.x, bounds.left), maxX),
    y: Math.min(Math.max(position.y, bounds.top), maxY),
  };
}

export function isPositionValid(position, size, bounds) {
  const r = rectFrom(position, size);
  return r.left >= bounds.left - 0.5 && r.top >= bounds.top - 0.5 && r.right <= bounds.right + 0.5 && r.bottom <= bounds.bottom + 0.5;
}

/**
 * Tries to find a spot for `movingRect` (as {x,y} position + size) that
 * doesn't overlap `obstacleRect`, by nudging along whichever axis clears the
 * overlap with the smallest shift. Returns a position or null if nothing
 * inside bounds works (caller should fall back to reverting the drag).
 */
export function findNearestFreePosition(position, size, obstacleRect, bounds) {
  const rect = rectFrom(position, size);
  if (!rectsOverlap(rect, obstacleRect, 8)) return position;

  const shiftRight = obstacleRect.right + 8 - rect.left;
  const shiftLeft = obstacleRect.left - 8 - rect.right;
  const shiftDown = obstacleRect.bottom + 8 - rect.top;
  const shiftUp = obstacleRect.top - 8 - rect.bottom;

  const candidates = [
    { x: position.x + shiftRight, y: position.y },
    { x: position.x + shiftLeft, y: position.y },
    { x: position.x, y: position.y + shiftDown },
    { x: position.x, y: position.y + shiftUp },
  ];

  for (const candidate of candidates) {
    const clamped = clampWidgetToDesktop(candidate, size, bounds);
    const clampedRect = rectFrom(clamped, size);
    if (!rectsOverlap(clampedRect, obstacleRect, 4) && isPositionValid(clamped, size, bounds)) {
      return clamped;
    }
  }
  return null;
}

/**
 * Resolves a dropped icon's final spot when it actually overlaps something.
 * Snaps to the grid (icon box + small gap, see GRID_CELL_WIDTH/HEIGHT) and
 * searches every reachable cell, picking whichever free one sits physically
 * closest to the exact point the user released the icon at. Because grid
 * cells are spaced by the icon's own box size plus a small gap, adjacent
 * cells never overlap by construction — so this naturally checks the
 * dropped cell, then its immediate neighbors, then the next ring out, etc.,
 * without needing a hand-written ring-search order. Only reached when the
 * raw drop position genuinely overlaps an obstacle; a free raw drop is kept
 * exactly where the user released it (see moveIcon).
 */
export function findNearestFreeIconCell(dropPosition, bounds, obstacles, margin = ICON_COLLISION_MARGIN) {
  const cols = Math.max(1, Math.floor((bounds.right - bounds.left) / GRID_CELL_WIDTH));
  const rows = Math.max(1, Math.floor((bounds.bottom - bounds.top) / GRID_CELL_HEIGHT));

  let best = null;
  let bestDist = Infinity;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = bounds.left + c * GRID_CELL_WIDTH;
      const y = bounds.top + r * GRID_CELL_HEIGHT;
      const rect = rectFrom({ x, y }, ICON_BOX_SIZE);
      if (rect.right > bounds.right + 0.5 || rect.bottom > bounds.bottom + 0.5) continue;
      if (obstacles.some((o) => rectsOverlap(rect, o, margin))) continue;

      const dx = x - dropPosition.x;
      const dy = y - dropPosition.y;
      const dist = dx * dx + dy * dy;
      if (dist < bestDist) {
        bestDist = dist;
        best = { x, y };
      }
    }
  }
  return best;
}

/**
 * Builds the invisible icon grid and assigns each icon a spot, preferring
 * its explicit default target (see DEFAULT_ICON_LAYOUT in constants.js) when
 * one is given and actually free; otherwise falls back to the nearest free
 * cell on that side (nearest to its own edge, top to bottom), so a target
 * that's blocked by a widget — or an icon with no target at all — still
 * always lands somewhere valid. Cells that fall inside the reserved center
 * band (wallpaper subject) or overlap a widget rect are skipped entirely.
 */
export function resolveIconLayout({ leftIds, rightIds, bounds, widgetRects, defaultLayout = {} }) {
  const usableWidth = bounds.right - bounds.left;
  const reservedLeft = bounds.left + usableWidth * 0.3;
  const reservedRight = bounds.left + usableWidth * 0.7;

  const rows = [];
  for (let y = bounds.top; y + GRID_CELL_HEIGHT <= bounds.bottom; y += GRID_CELL_HEIGHT) rows.push(y);
  if (rows.length === 0) rows.push(bounds.top);

  const leftColumns = [];
  for (let x = bounds.left; x + GRID_CELL_WIDTH <= reservedLeft; x += GRID_CELL_WIDTH) leftColumns.push(x);
  const rightColumns = [];
  for (let x = bounds.right - GRID_CELL_WIDTH; x >= reservedRight; x -= GRID_CELL_WIDTH) rightColumns.push(x);
  // Guarantee at least one column per side even on very narrow viewports.
  if (leftColumns.length === 0) leftColumns.push(bounds.left);
  if (rightColumns.length === 0) rightColumns.push(Math.max(bounds.right - GRID_CELL_WIDTH, bounds.left));

  const cellBlocked = (x, y) => {
    const cellRect = { left: x, top: y, right: x + GRID_CELL_WIDTH, bottom: y + GRID_CELL_HEIGHT };
    return widgetRects.some((w) => rectsOverlap(cellRect, w, CELL_PADDING));
  };

  const occupied = new Set();
  const positions = {};
  const strandedCounts = new Map();

  // Places a single icon at the nearest free cell on its side (column-major
  // from the edge). Keys are namespaced by side so the left and right zones
  // — which reuse the same small column/row indices for entirely different
  // physical columns — never mistake each other's cells as occupied. This is
  // both the fallback for icons with no target and the safety net for a
  // target row/group that turned out to be blocked, taken, or unreachable.
  const placeFallback = (id, side, columns) => {
    for (let c = 0; c < columns.length; c++) {
      for (let r = 0; r < rows.length; r++) {
        const key = `${side}:${c}:${r}`;
        if (occupied.has(key)) continue;
        if (cellBlocked(columns[c], rows[r])) continue;
        occupied.add(key);
        positions[id] = { x: columns[c], y: rows[r] };
        return;
      }
    }
    // Truly nothing free anywhere in the visible grid on this side (desktop
    // is extremely small) — extend a virtual sub-grid downward past the last
    // real row, wrapping across this side's own columns, so every stranded
    // icon still gets its own full-size, non-overlapping cell. Side-aware
    // (uses this side's own columns) so a stranded right-side icon never
    // lands on the left edge on top of a left-side icon. This may push an
    // icon below the visible desktop area on truly tiny viewports, which is
    // an acceptable last resort — icon-on-icon overlap is not.
    const strandedIndex = strandedCounts.get(side) || 0;
    strandedCounts.set(side, strandedIndex + 1);
    const perRow = Math.max(1, columns.length);
    const wrapRow = Math.floor(strandedIndex / perRow);
    const wrapCol = strandedIndex % perRow;
    const fallbackX = columns[wrapCol] ?? bounds.left;
    const fallbackY = bounds.top + (rows.length + wrapRow) * GRID_CELL_HEIGHT;
    positions[id] = { x: fallbackX, y: fallbackY };
  };

  const place = (ids, side, columns) => {
    // Icons with an explicit target for this side are grouped by their
    // intended row, so a whole row of icons is placed together or not at
    // all — this is what prevents two different target rows from silently
    // clamping down onto the same actual row on short viewports and
    // colliding. Groups are tried in ascending target-row order, each one
    // searching forward from wherever the previous group landed, so the
    // literal row numbers in DEFAULT_ICON_LAYOUT are only a preference —
    // correctness (no overlaps) never depends on them being reachable.
    const withTarget = ids.filter((id) => defaultLayout[id]?.side === side);
    const withoutTarget = ids.filter((id) => !(defaultLayout[id]?.side === side));

    const rowGroups = new Map();
    withTarget.forEach((id) => {
      const target = defaultLayout[id];
      const members = rowGroups.get(target.row) || [];
      members.push({ id, col: target.col });
      rowGroups.set(target.row, members);
    });

    const orderedGroups = [...rowGroups.entries()].sort((a, b) => a[0] - b[0]);

    let searchFromRow = 0;
    orderedGroups.forEach(([, members]) => {
      members.sort((a, b) => a.col - b.col);

      // If this side doesn't have enough columns for the group's distinct
      // target columns to stay distinct once clamped (narrow viewport), two
      // members would land on the exact same cell no matter which row is
      // picked — skip the group search entirely and place each member
      // individually instead.
      const clampedCols = members.map(({ col }) => Math.min(col, columns.length - 1));
      const hasColumnClash = new Set(clampedCols).size !== clampedCols.length;

      let foundRow = -1;
      if (!hasColumnClash) {
        for (let r = searchFromRow; r < rows.length; r++) {
          const allClear = members.every(({ col }) => {
            const c = Math.min(col, columns.length - 1);
            return !occupied.has(`${side}:${c}:${r}`) && !cellBlocked(columns[c], rows[r]);
          });
          if (allClear) {
            foundRow = r;
            break;
          }
        }
      }

      if (foundRow !== -1) {
        members.forEach(({ id, col }) => {
          const c = Math.min(col, columns.length - 1);
          occupied.add(`${side}:${c}:${foundRow}`);
          positions[id] = { x: columns[c], y: rows[foundRow] };
        });
        searchFromRow = foundRow + 1;
      } else {
        // No row could fit the whole group as-is (very short viewport) —
        // place each member individually instead of leaving it stranded.
        members.forEach(({ id }) => placeFallback(id, side, columns));
      }
    });

    withoutTarget.forEach((id) => placeFallback(id, side, columns));
  };

  place(leftIds, "left", leftColumns);
  place(rightIds, "right", rightColumns);

  return positions;
}
