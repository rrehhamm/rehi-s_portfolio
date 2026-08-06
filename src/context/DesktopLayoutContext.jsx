import { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from "react";
import {
  getDesktopBounds, clampWidgetToDesktop, isPositionValid, rectFrom, rectsOverlap,
  findNearestFreePosition, findNearestFreeIconCell, resolveIconLayout,
  ICON_BOX_WIDTH, ICON_BOX_HEIGHT, ICON_COLLISION_MARGIN, GRID_CELL_HEIGHT,
} from "../utils/layoutMath";
import { DESKTOP_ICONS, DEFAULT_ICON_LAYOUT } from "../utils/constants";

const DesktopLayoutContext = createContext(null);

const WELCOME_DEFAULT_SIZE = { width: 270, height: 244 };
const SPOTIFY_DEFAULT_SIZE = { width: 300, height: 150 };
const ICON_SIZE = { width: ICON_BOX_WIDTH, height: ICON_BOX_HEIGHT };
const ICON_POSITIONS_KEY = "desktopIconPositions";
// Bumped whenever the icon/grid dimensions change materially — old saved
// positions were placed under the previous (much larger) grid, so on a
// version bump we start clean on the new compact default layout once,
// instead of carrying over now-stale coordinates.
const DESKTOP_LAYOUT_VERSION = 2;
const LAYOUT_VERSION_KEY = "desktopLayoutVersion";

// Which side of the desktop each icon defaults to — derived from
// DEFAULT_ICON_LAYOUT so the grouping always matches the intended default
// arrangement (see constants.js). Icons with no entry there simply fall
// back to whichever side has room, via resolveIconLayout's generic scan.
const LEFT_ICON_IDS = DESKTOP_ICONS.map((i) => i.id).filter((id) => DEFAULT_ICON_LAYOUT[id]?.side === "left");
const RIGHT_ICON_IDS = DESKTOP_ICONS.map((i) => i.id).filter((id) => DEFAULT_ICON_LAYOUT[id]?.side !== "left");

function readStoredPosition(key) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.x === "number" && typeof parsed?.y === "number") return parsed;
  } catch {
    /* ignore malformed storage */
  }
  return null;
}

function writeStoredPosition(key, position) {
  try {
    window.localStorage.setItem(key, JSON.stringify(position));
  } catch {
    /* storage unavailable */
  }
}

function readStoredIconPositions(bounds) {
  try {
    const raw = window.localStorage.getItem(ICON_POSITIONS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    const valid = {};
    for (const [id, pos] of Object.entries(parsed)) {
      if (typeof pos?.x === "number" && typeof pos?.y === "number" && isPositionValid(pos, ICON_SIZE, bounds)) {
        valid[id] = pos;
      }
    }
    return valid;
  } catch {
    return {};
  }
}

function writeStoredIconPositions(positions) {
  try {
    window.localStorage.setItem(ICON_POSITIONS_KEY, JSON.stringify(positions));
  } catch {
    /* storage unavailable */
  }
}

/** Validates stored icon positions against the current layout version,
 * clearing them exactly once if the grid/icon dimensions changed since they
 * were saved (see DESKTOP_LAYOUT_VERSION), then stamps the new version so
 * this only runs a single time per browser. */
function migrateIconPositions(bounds) {
  let storedVersion = null;
  try {
    storedVersion = window.localStorage.getItem(LAYOUT_VERSION_KEY);
  } catch {
    /* ignore */
  }
  if (storedVersion === String(DESKTOP_LAYOUT_VERSION)) {
    return readStoredIconPositions(bounds);
  }
  try {
    window.localStorage.removeItem(ICON_POSITIONS_KEY);
    window.localStorage.setItem(LAYOUT_VERSION_KEY, String(DESKTOP_LAYOUT_VERSION));
  } catch {
    /* storage unavailable */
  }
  return {};
}

function defaultWelcomePosition(bounds) {
  return clampWidgetToDesktop({ x: bounds.right - WELCOME_DEFAULT_SIZE.width - 8, y: bounds.top + 8 }, WELCOME_DEFAULT_SIZE, bounds);
}
// Default spot: left edge, just below the top row of icons — matches the
// intended out-of-the-box arrangement (see DEFAULT_ICON_LAYOUT). The extra
// +16 keeps it clear of that row's own grid cell (icon-grid collision
// checks include a small padding, so sitting exactly on the boundary would
// wrongly read as blocking the row above it).
function defaultSpotifyPosition(bounds) {
  return clampWidgetToDesktop({ x: bounds.left, y: bounds.top + GRID_CELL_HEIGHT + 16 }, SPOTIFY_DEFAULT_SIZE, bounds);
}

function getViewport() {
  return { width: window.innerWidth, height: window.innerHeight };
}

export function DesktopLayoutProvider({ children }) {
  const [viewport, setViewport] = useState(getViewport);
  const bounds = useMemo(() => getDesktopBounds(viewport.width, viewport.height), [viewport]);

  const [welcome, setWelcome] = useState(() => {
    const b = getDesktopBounds(getViewport().width, getViewport().height);
    const stored = readStoredPosition("welcomeWidgetPosition");
    const position = stored && isPositionValid(stored, WELCOME_DEFAULT_SIZE, b) ? stored : defaultWelcomePosition(b);
    return { position, size: WELCOME_DEFAULT_SIZE, visible: true };
  });
  const [spotify, setSpotify] = useState(() => {
    const b = getDesktopBounds(getViewport().width, getViewport().height);
    const stored = readStoredPosition("spotifyWidgetPosition");
    const position = stored && isPositionValid(stored, SPOTIFY_DEFAULT_SIZE, b) ? stored : defaultSpotifyPosition(b);
    let visible = true;
    try {
      const raw = window.localStorage.getItem("rehi-spotify-widget-visible");
      if (raw !== null) visible = JSON.parse(raw);
    } catch { /* default true */ }
    return { position, size: SPOTIFY_DEFAULT_SIZE, visible };
  });

  const [dragPreview, setDragPreview] = useState(null); // { widgetId, rect } while actively dragging
  const lastValidRef = useRef({ welcome: welcome.position, spotify: spotify.position });
  // Latest committed icon positions, kept in a ref so moveIcon can read them
  // without needing to be recreated (and re-bound to the drag hook) on every render.
  const iconPositionsRef = useRef({});

  // User-repositioned desktop icons (id -> {x,y}). Icons without an entry
  // here fall back to the automatic grid layout below.
  const [iconOverrides, setIconOverrides] = useState(() => {
    const b = getDesktopBounds(getViewport().width, getViewport().height);
    return migrateIconPositions(b);
  });

  // Track viewport changes (debounced via rAF) and re-clamp both widgets.
  useEffect(() => {
    let frame = null;
    const onResize = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setViewport(getViewport()));
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    setWelcome((w) => {
      const next = clampWidgetToDesktop(w.position, w.size, bounds);
      return next.x === w.position.x && next.y === w.position.y ? w : { ...w, position: next };
    });
    setSpotify((s) => {
      const next = clampWidgetToDesktop(s.position, s.size, bounds);
      return next.x === s.position.x && next.y === s.position.y ? s : { ...s, position: next };
    });
  }, [bounds]);

  // Re-clamp any manually-moved icons whenever the desktop bounds change
  // (e.g. window resize) so a saved position never ends up off-screen.
  useEffect(() => {
    setIconOverrides((prev) => {
      let changed = false;
      const next = {};
      for (const [id, pos] of Object.entries(prev)) {
        const clamped = clampWidgetToDesktop(pos, ICON_SIZE, bounds);
        if (clamped.x !== pos.x || clamped.y !== pos.y) changed = true;
        next[id] = clamped;
      }
      if (!changed) return prev;
      writeStoredIconPositions(next);
      return next;
    });
  }, [bounds]);

  const persistWelcome = useCallback((position) => writeStoredPosition("welcomeWidgetPosition", position), []);
  const persistSpotify = useCallback((position) => writeStoredPosition("spotifyWidgetPosition", position), []);

  const setWidgetSize = useCallback((widgetId, size) => {
    const setter = widgetId === "welcome" ? setWelcome : setSpotify;
    setter((w) => (w.size.width === size.width && w.size.height === size.height ? w : { ...w, size }));
  }, []);

  const setWidgetVisible = useCallback((widgetId, visible) => {
    const setter = widgetId === "welcome" ? setWelcome : setSpotify;
    setter((w) => ({ ...w, visible }));
    if (widgetId === "spotify") {
      try { window.localStorage.setItem("rehi-spotify-widget-visible", JSON.stringify(visible)); } catch { /* no-op */ }
    }
  }, []);

  /** Called by useDraggableWidget on every drag frame — visual-only, no icon recalculation. */
  const updateDragPreview = useCallback((widgetId, position, size) => {
    setDragPreview({ widgetId, rect: rectFrom(position, size) });
  }, []);

  const clearDragPreview = useCallback(() => setDragPreview(null), []);

  /** Called on drag end: clamps to desktop, resolves widget-vs-widget overlap, persists, and commits. */
  const commitWidgetPosition = useCallback((widgetId, rawPosition) => {
    const isWelcome = widgetId === "welcome";
    const mine = isWelcome ? welcome : spotify;
    const other = isWelcome ? spotify : welcome;

    let next = clampWidgetToDesktop(rawPosition, mine.size, bounds);

    if (other.visible) {
      const otherRect = rectFrom(other.position, other.size);
      const resolved = findNearestFreePosition(next, mine.size, otherRect, bounds);
      next = resolved || lastValidRef.current[widgetId];
    }

    lastValidRef.current[widgetId] = next;
    (isWelcome ? setWelcome : setSpotify)((w) => ({ ...w, position: next }));
    (isWelcome ? persistWelcome : persistSpotify)(next);
    setDragPreview(null);
  }, [welcome, spotify, bounds, persistWelcome, persistSpotify]);

  const resetWidgetPositions = useCallback(() => {
    const w = defaultWelcomePosition(bounds);
    const s = defaultSpotifyPosition(bounds);
    setWelcome((prev) => ({ ...prev, position: w }));
    setSpotify((prev) => ({ ...prev, position: s }));
    lastValidRef.current = { welcome: w, spotify: s };
    persistWelcome(w);
    persistSpotify(s);
  }, [bounds, persistWelcome, persistSpotify]);

  /**
   * Called when a user finishes manually dragging a desktop icon. If the
   * exact spot they dropped it at doesn't actually overlap anything, it's
   * kept exactly as released — no snapping, no repositioning. Only when
   * there's a genuine overlap (using the icon's real visible box, not an
   * oversized invisible hitbox) does it snap to the nearest free grid cell
   * to that same drop point, so a conflict resolves nearby instead of
   * teleporting across the desktop.
   */
  const moveIcon = useCallback((iconId, rawPosition) => {
    const clampedDrop = clampWidgetToDesktop(rawPosition, ICON_SIZE, bounds);

    const obstacles = [];
    if (welcome.visible) obstacles.push(rectFrom(welcome.position, welcome.size));
    if (spotify.visible) obstacles.push(rectFrom(spotify.position, spotify.size));
    Object.entries(iconPositionsRef.current).forEach(([id, pos]) => {
      if (id === iconId) return;
      obstacles.push(rectFrom(pos, ICON_SIZE));
    });

    const dropRect = rectFrom(clampedDrop, ICON_SIZE);
    const overlapping = obstacles.some((o) => rectsOverlap(dropRect, o, ICON_COLLISION_MARGIN));
    const next = overlapping
      ? findNearestFreeIconCell(clampedDrop, bounds, obstacles) || clampedDrop
      : clampedDrop;

    setIconOverrides((prev) => {
      const updated = { ...prev, [iconId]: next };
      writeStoredIconPositions(updated);
      return updated;
    });
  }, [welcome, spotify, bounds]);

  const resetIconPositions = useCallback(() => {
    setIconOverrides({});
    writeStoredIconPositions({});
  }, []);

  // Recompute the icon grid whenever a widget moves, resizes, shows/hides,
  // the viewport changes, or an icon is manually repositioned. Manually
  // placed icons keep their saved spot; the rest flow around them (and the
  // widgets) via the same grid-assignment algorithm.
  const iconPositions = useMemo(() => {
    const widgetRects = [];
    if (welcome.visible) widgetRects.push(rectFrom(welcome.position, welcome.size));
    if (spotify.visible) widgetRects.push(rectFrom(spotify.position, spotify.size));

    const overriddenIds = Object.keys(iconOverrides);
    overriddenIds.forEach((id) => widgetRects.push(rectFrom(iconOverrides[id], ICON_SIZE)));

    const leftRemaining = LEFT_ICON_IDS.filter((id) => !(id in iconOverrides));
    const rightRemaining = RIGHT_ICON_IDS.filter((id) => !(id in iconOverrides));

    const gridPositions = resolveIconLayout({ leftIds: leftRemaining, rightIds: rightRemaining, bounds, widgetRects, defaultLayout: DEFAULT_ICON_LAYOUT });
    return { ...gridPositions, ...iconOverrides };
  }, [welcome.visible, welcome.position, welcome.size, spotify.visible, spotify.position, spotify.size, bounds, iconOverrides]);

  useEffect(() => {
    iconPositionsRef.current = iconPositions;
  }, [iconPositions]);

  // Which icons currently sit under the widget being dragged (for a live highlight, not a move).
  const previewOverlapIds = useMemo(() => {
    if (!dragPreview) return [];
    return Object.entries(iconPositions)
      .filter(([, pos]) => {
        const iconRect = { left: pos.x, top: pos.y, right: pos.x + ICON_SIZE.width, bottom: pos.y + ICON_SIZE.height };
        return (
          iconRect.left < dragPreview.rect.right &&
          iconRect.right > dragPreview.rect.left &&
          iconRect.top < dragPreview.rect.bottom &&
          iconRect.bottom > dragPreview.rect.top
        );
      })
      .map(([id]) => id);
  }, [dragPreview, iconPositions]);

  const value = useMemo(() => ({
    welcome, spotify, bounds, iconPositions, previewOverlapIds,
    setWidgetSize, setWidgetVisible, updateDragPreview, clearDragPreview,
    commitWidgetPosition, resetWidgetPositions,
    moveIcon, resetIconPositions,
  }), [welcome, spotify, bounds, iconPositions, previewOverlapIds, setWidgetSize, setWidgetVisible, updateDragPreview, clearDragPreview, commitWidgetPosition, resetWidgetPositions, moveIcon, resetIconPositions]);

  return <DesktopLayoutContext.Provider value={value}>{children}</DesktopLayoutContext.Provider>;
}

export function useDesktopLayout() {
  const ctx = useContext(DesktopLayoutContext);
  if (!ctx) throw new Error("useDesktopLayout must be used within DesktopLayoutProvider");
  return ctx;
}
