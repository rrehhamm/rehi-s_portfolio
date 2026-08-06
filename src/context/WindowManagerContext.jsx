import { createContext, useContext, useReducer, useCallback, useMemo } from "react";
import { WINDOW_REGISTRY } from "../utils/windowRegistry";

const WindowManagerContext = createContext(null);

let zCounter = 10;
let cascadeCounter = 0;

function defaultPositionFor(size) {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const cascadeOffset = (cascadeCounter % 6) * 28;
  cascadeCounter += 1;
  const x = Math.max(24, Math.round((vw - size.width) / 2) + cascadeOffset - 60);
  const y = Math.max(48, Math.round((vh - size.height) / 2) + cascadeOffset - 40);
  return { x, y };
}

function makeInitialWindowState(id, params) {
  const config = WINDOW_REGISTRY[id];
  const size = { ...config.defaultSize };
  return {
    id,
    title: config.title,
    icon: config.icon,
    size,
    position: defaultPositionFor(size),
    prevSize: size,
    prevPosition: null,
    minimized: false,
    maximized: false,
    isOpen: true,
    zIndex: ++zCounter,
    params: params || {},
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "OPEN": {
      const { id, params } = action;
      const existing = state.windows[id];
      if (existing && existing.isOpen) {
        // Already open — focus it instead of creating a duplicate.
        return {
          ...state,
          windows: {
            ...state.windows,
            [id]: {
              ...existing,
              minimized: false,
              zIndex: ++zCounter,
              params: params ? { ...existing.params, ...params } : existing.params,
            },
          },
          activeId: id,
        };
      }
      const base = existing
        ? { ...existing, isOpen: true, minimized: false, zIndex: ++zCounter, params: params || existing.params || {} }
        : makeInitialWindowState(id, params);
      return {
        ...state,
        windows: { ...state.windows, [id]: base },
        activeId: id,
      };
    }
    case "CLOSE": {
      if (!state.windows[action.id]) return state;
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: { ...state.windows[action.id], isOpen: false, minimized: false },
        },
        activeId: state.activeId === action.id ? null : state.activeId,
      };
    }
    case "CLOSE_ALL": {
      const windows = {};
      Object.entries(state.windows).forEach(([id, w]) => {
        windows[id] = { ...w, isOpen: false, minimized: false };
      });
      return { ...state, windows, activeId: null };
    }
    case "FOCUS": {
      if (!state.windows[action.id]) return state;
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: { ...state.windows[action.id], zIndex: ++zCounter },
        },
        activeId: action.id,
      };
    }
    case "MINIMIZE": {
      if (!state.windows[action.id]) return state;
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: { ...state.windows[action.id], minimized: true },
        },
        activeId: state.activeId === action.id ? null : state.activeId,
      };
    }
    case "TOGGLE_MAXIMIZE": {
      const w = state.windows[action.id];
      if (!w) return state;
      if (w.maximized) {
        return {
          ...state,
          windows: {
            ...state.windows,
            [action.id]: {
              ...w,
              maximized: false,
              size: w.prevSize || w.size,
              position: w.prevPosition || w.position,
              zIndex: ++zCounter,
            },
          },
          activeId: action.id,
        };
      }
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: {
            ...w,
            maximized: true,
            prevSize: w.size,
            prevPosition: w.position,
            minimized: false,
            zIndex: ++zCounter,
          },
        },
        activeId: action.id,
      };
    }
    case "MOVE": {
      const w = state.windows[action.id];
      if (!w) return state;
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: { ...w, position: action.position },
        },
      };
    }
    case "RESIZE": {
      const w = state.windows[action.id];
      if (!w) return state;
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: { ...w, size: action.size },
        },
      };
    }
    case "RESET_POSITIONS": {
      cascadeCounter = 0;
      const windows = {};
      Object.entries(state.windows).forEach(([id, w]) => {
        const size = { ...WINDOW_REGISTRY[id].defaultSize };
        windows[id] = {
          ...w,
          size,
          position: defaultPositionFor(size),
          maximized: false,
          prevSize: null,
          prevPosition: null,
        };
      });
      return { ...state, windows };
    }
    default:
      return state;
  }
}

export function WindowManagerProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { windows: {}, activeId: null });

  const openWindow = useCallback((id, params) => dispatch({ type: "OPEN", id, params }), []);
  const closeWindow = useCallback((id) => dispatch({ type: "CLOSE", id }), []);
  const closeAll = useCallback(() => dispatch({ type: "CLOSE_ALL" }), []);
  const focusWindow = useCallback((id) => dispatch({ type: "FOCUS", id }), []);
  const minimizeWindow = useCallback((id) => dispatch({ type: "MINIMIZE", id }), []);
  const toggleMaximize = useCallback((id) => dispatch({ type: "TOGGLE_MAXIMIZE", id }), []);
  const moveWindow = useCallback((id, position) => dispatch({ type: "MOVE", id, position }), []);
  const resizeWindow = useCallback((id, size) => dispatch({ type: "RESIZE", id, size }), []);
  const resetPositions = useCallback(() => dispatch({ type: "RESET_POSITIONS" }), []);

  const restoreWindow = useCallback((id) => {
    dispatch({ type: "OPEN", id });
  }, []);

  const toggleWindow = useCallback((id, params) => {
    const w = state.windows[id];
    if (w && w.isOpen && !w.minimized) {
      dispatch({ type: "CLOSE", id });
    } else {
      dispatch({ type: "OPEN", id, params });
    }
  }, [state.windows]);

  const openWindows = useMemo(
    () => Object.values(state.windows).filter((w) => w.isOpen),
    [state.windows]
  );

  const value = useMemo(() => ({
    windows: state.windows,
    activeId: state.activeId,
    openWindows,
    openWindow,
    closeWindow,
    closeAll,
    focusWindow,
    minimizeWindow,
    restoreWindow,
    toggleMaximize,
    moveWindow,
    resizeWindow,
    resetPositions,
    toggleWindow,
  }), [state, openWindows, openWindow, closeWindow, closeAll, focusWindow, minimizeWindow, restoreWindow, toggleMaximize, moveWindow, resizeWindow, resetPositions, toggleWindow]);

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) throw new Error("useWindowManager must be used within WindowManagerProvider");
  return ctx;
}
