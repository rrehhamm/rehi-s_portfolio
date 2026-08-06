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
 * Builds the invisible icon grid and assigns each icon to the nearest free
 * cell, preferring the edge column it started closest to. Cells that fall
 * inside the reserved center band (wallpaper subject) or overlap a widget
 * rect are skipped entirely.
 */
export function resolveIconLayout({ leftIds, rightIds, bounds, widgetRects }) {
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

  const place = (ids, columns) => {
    ids.forEach((id) => {
      let placed = false;
      for (let c = 0; c < columns.length && !placed; c++) {
        for (let r = 0; r < rows.length && !placed; r++) {
          const key = `${c}:${r}`;
          if (occupied.has(key)) continue;
          if (cellBlocked(columns[c], rows[r])) continue;
          occupied.add(key);
          positions[id] = { x: columns[c], y: rows[r] };
          placed = true;
        }
      }
      if (!placed) {
        // Degenerate fallback — desktop is extremely small or fully blocked.
        positions[id] = { x: bounds.left, y: bounds.top };
      }
    });
  };

  place(leftIds, leftColumns);
  place(rightIds, rightColumns);

  return positions;
}
