import { useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowManager } from "../../context/WindowManagerContext";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { useDock } from "../../context/DockContext";
import { getIcon } from "../../utils/iconMap";
import { WINDOW_REGISTRY } from "../../utils/windowRegistry";
import WindowControls from "./WindowControls";
import "./Window.css";

const MENUBAR_H = 30;
const MARGIN = 8;
const MOBILE_DOCK_H = 64; // must match .dock--mobile's rendered height in Dock.css

export default function Window({ id, children }) {
  const {
    windows, activeId, focusWindow, closeWindow, minimizeWindow,
    toggleMaximize, moveWindow, resizeWindow,
  } = useWindowManager();
  const isMobile = useIsMobile();
  const { dockMode, isForcingWindow } = useDock();
  const win = windows[id];
  const dragRef = useRef(null);
  const resizeRef = useRef(null);

  const isActive = activeId === id;
  const Icon = win ? getIcon(win.icon) : null;

  const clamp = useCallback((pos, size) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxX = Math.max(MARGIN, vw - size.width - MARGIN);
    const maxY = Math.max(MENUBAR_H + MARGIN, vh - size.height - MARGIN);
    return {
      x: Math.min(Math.max(pos.x, MARGIN), maxX),
      y: Math.min(Math.max(pos.y, MENUBAR_H + MARGIN), maxY),
    };
  }, []);

  const handleTitleBarPointerDown = useCallback((e) => {
    if (isMobile || win.maximized) return;
    if (e.target.closest(".window-controls")) return;
    focusWindow(id);
    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = { ...win.position };
    dragRef.current = { startX, startY, startPos };

    const onMove = (ev) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      const next = clamp(
        { x: dragRef.current.startPos.x + dx, y: dragRef.current.startPos.y + dy },
        win.size
      );
      moveWindow(id, next);
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, [isMobile, win, id, focusWindow, moveWindow, clamp]);

  const handleResizePointerDown = useCallback((e) => {
    if (isMobile || win.maximized) return;
    e.stopPropagation();
    focusWindow(id);
    const startX = e.clientX;
    const startY = e.clientY;
    const startSize = { ...win.size };
    const minSize = WINDOW_REGISTRY[id]?.minSize || { width: 360, height: 320 };
    const minW = minSize.width;
    const minH = minSize.height;
    resizeRef.current = { startX, startY, startSize };

    const onMove = (ev) => {
      if (!resizeRef.current) return;
      const dx = ev.clientX - resizeRef.current.startX;
      const dy = ev.clientY - resizeRef.current.startY;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const maxW = vw - win.position.x - MARGIN;
      const maxH = vh - win.position.y - MARGIN;
      const width = Math.min(Math.max(resizeRef.current.startSize.width + dx, minW), maxW);
      const height = Math.min(Math.max(resizeRef.current.startSize.height + dy, minH), maxH);
      resizeWindow(id, { width, height });
    };
    const onUp = () => {
      resizeRef.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, [isMobile, win, id, focusWindow, resizeWindow]);

  useEffect(() => {
    const onResize = () => {
      if (!win || isMobile || win.maximized) return;
      moveWindow(id, clamp(win.position, win.size));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [win?.position?.x, win?.position?.y, win?.size?.width, win?.size?.height]);

  useEffect(() => {
    if (!isActive) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeWindow(id);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isActive, id, closeWindow]);

  if (!win || !win.isOpen) return null;

  const fullscreen = isMobile || win.maximized;
  // Mobile always has the bottom nav bar, so fullscreen windows stop short
  // of it entirely — no overlap possible, no padding hack needed there.
  const bottomInset = isMobile ? MOBILE_DOCK_H : 0;
  const style = fullscreen
    ? { left: 0, top: MENUBAR_H, width: "100%", height: `calc(100% - ${MENUBAR_H}px - ${bottomInset}px)`, zIndex: win.zIndex }
    : { left: win.position.x, top: win.position.y, width: win.size.width, height: win.size.height, zIndex: win.zIndex };

  // Desktop only: when the user has explicitly forced "Always Visible" and
  // this particular window is maximized/very tall (the case that would
  // otherwise auto-hide the dock), reserve room at the bottom of the
  // window's content so the dock never sits on top of the last element.
  const needsDockReserve = !isMobile && dockMode === "always" && isForcingWindow(win);
  style["--dock-reserve"] = needsDockReserve ? "calc(var(--dock-height) + 16px)" : "0px";

  return (
    <AnimatePresence>
      {!win.minimized && (
        <motion.section
          className={`os-window ${isActive ? "os-window--active" : ""} ${fullscreen ? "os-window--fullscreen" : ""}`}
          style={style}
          role="dialog"
          aria-label={win.title}
          aria-modal="false"
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          onPointerDown={() => !isActive && focusWindow(id)}
        >
          <header
            className="os-window__titlebar"
            onPointerDown={handleTitleBarPointerDown}
            onDoubleClick={() => !isMobile && toggleMaximize(id)}
          >
            <WindowControls
              onClose={() => closeWindow(id)}
              onMinimize={() => minimizeWindow(id)}
              onMaximize={() => toggleMaximize(id)}
              maximized={win.maximized}
            />
            <div className="os-window__title">
              {Icon && <Icon size={14} strokeWidth={2} />}
              <span>{win.title}</span>
            </div>
            <div className="os-window__titlebar-spacer" />
          </header>
          <div className="os-window__body scrollable">{children}</div>
          {!fullscreen && (
            <div
              className="os-window__resize-handle"
              onPointerDown={handleResizePointerDown}
              aria-hidden="true"
            />
          )}
        </motion.section>
      )}
    </AnimatePresence>
  );
}
