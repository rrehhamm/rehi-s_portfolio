import { useState, useCallback } from "react";
import { useIsMobile, useIsTablet } from "./useMediaQuery";

function readStored(key) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    return typeof parsed === "boolean" ? parsed : null;
  } catch {
    return null;
  }
}

function writeStored(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

/**
 * Manages a single window's sidebar collapsed state, persisted per-window
 * under `storageKey` (e.g. "projectsSidebarCollapsed"). Collapsing is a pure
 * CSS width transition on the caller's side — this hook never unmounts
 * anything, so scroll position and the active tab/section are untouched.
 *
 * Defaults (only used the first time, before anything is saved): expanded on
 * desktop, collapsed on tablet. On mobile the sidebar never sits inline —
 * callers should render it as a drawer instead, toggled via `mobileOpen`.
 */
export function useSidebarCollapse(storageKey) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const [collapsed, setCollapsedState] = useState(() => {
    const stored = readStored(storageKey);
    return stored !== null ? stored : isTablet;
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const setCollapsed = useCallback((value) => {
    setCollapsedState(value);
    writeStored(storageKey, value);
  }, [storageKey]);

  const toggle = useCallback(() => setCollapsed(!collapsed), [collapsed, setCollapsed]);

  return {
    collapsed,
    toggle,
    setCollapsed,
    isMobile,
    mobileOpen,
    openMobile: useCallback(() => setMobileOpen(true), []),
    closeMobile: useCallback(() => setMobileOpen(false), []),
  };
}
