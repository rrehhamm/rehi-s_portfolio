import { createContext, useContext, useMemo, useCallback } from "react";
import { useTheme } from "./ThemeContext";
import { useWindowManager } from "./WindowManagerContext";
import { useIsMobile } from "../hooks/useMediaQuery";

const DockContext = createContext(null);

const MENUBAR_H = 30;
const TALL_RATIO = 0.82; // a window this close to the full usable height counts as "very tall"

function windowIsForcing(win, viewportHeight) {
  if (!win || !win.isOpen || win.minimized) return false;
  if (win.maximized) return true;
  const usable = viewportHeight - MENUBAR_H;
  return win.size.height >= usable * TALL_RATIO;
}

/**
 * Central place that reconciles the user's Dock setting (Always Visible /
 * Auto Hide / no explicit choice yet) with the currently open windows, so
 * both the Dock itself and every Window instance agree on the same answer.
 *
 * - dockMode === "auto"    -> always auto-hide.
 * - dockMode === "always"  -> never auto-hide, even for a maximized window
 *   (the window instead reserves bottom padding so its content stays clear).
 * - dockMode === null      -> smart default: auto-hide only while a
 *   maximized/very tall window is open, otherwise behave like Always Visible.
 */
export function DockProvider({ children }) {
  const { dockMode, setDockMode } = useTheme();
  const { openWindows } = useWindowManager();
  const isMobile = useIsMobile();

  const hasForcingWindow = useMemo(() => {
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    return openWindows.some((w) => windowIsForcing(w, vh));
  }, [openWindows]);

  const autoHideActive = !isMobile && (dockMode === "auto" || (dockMode === null && hasForcingWindow));

  const isForcingWindow = useCallback((win) => {
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    return windowIsForcing(win, vh);
  }, []);

  const value = useMemo(() => ({
    dockMode, setDockMode, autoHideActive, hasForcingWindow, isForcingWindow, isMobile,
  }), [dockMode, setDockMode, autoHideActive, hasForcingWindow, isForcingWindow, isMobile]);

  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}

export function useDock() {
  const ctx = useContext(DockContext);
  if (!ctx) throw new Error("useDock must be used within DockProvider");
  return ctx;
}
