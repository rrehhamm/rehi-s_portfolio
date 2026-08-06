import { useState, useRef, useCallback, useEffect } from "react";
import { useDesktopLayout } from "../context/DesktopLayoutContext";
import { useIsMobile } from "./useMediaQuery";
import { clampWidgetToDesktop, ICON_BOX_SIZE } from "../utils/layoutMath";

const ICON_SIZE = ICON_BOX_SIZE;
const DRAG_THRESHOLD = 6; // px of movement before a pointerdown counts as a drag, not a click

/**
 * Makes a desktop icon manually draggable. Unlike the widgets, an icon has
 * no separate drag handle — the whole icon is both the click target (to
 * open it) and the drag target (to move it), so this hook distinguishes the
 * two by movement distance: a pointerdown that never moves past the
 * threshold is left alone and behaves like a normal click; one that does is
 * flagged via `wasDraggedRef` so the caller's click handler can ignore the
 * trailing click event browsers fire after a mouseup/pointerup.
 */
export function useDraggableIcon(iconId, position) {
  const { bounds, moveIcon } = useDesktopLayout();
  const isMobile = useIsMobile();
  const [dragging, setDragging] = useState(false);
  const [livePosition, setLivePosition] = useState(position);
  const dragRef = useRef(null);
  const rafRef = useRef(null);
  const wasDraggedRef = useRef(false);

  useEffect(() => {
    if (!dragging) setLivePosition(position);
  }, [position, dragging]);

  const handlePointerDown = useCallback((e) => {
    if (isMobile || !position) return;
    if (e.button !== undefined && e.button !== 0) return;

    const startPos = { ...position };
    dragRef.current = { startX: e.clientX, startY: e.clientY, startPos, next: startPos, crossed: false };

    const onMove = (ev) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = ev.clientX - drag.startX;
      const dy = ev.clientY - drag.startY;

      if (!drag.crossed) {
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
        drag.crossed = true;
        wasDraggedRef.current = true;
        setDragging(true);
      }

      const next = clampWidgetToDesktop({ x: drag.startPos.x + dx, y: drag.startPos.y + dy }, ICON_SIZE, bounds);
      drag.next = next;
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        setLivePosition(next);
      });
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      const drag = dragRef.current;
      dragRef.current = null;
      setDragging(false);
      if (drag?.crossed) {
        moveIcon(iconId, drag.next);
      }
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, [isMobile, position, bounds, iconId, moveIcon]);

  return {
    dragHandleProps: isMobile ? {} : { onPointerDown: handlePointerDown },
    dragging,
    position: dragging ? livePosition : position,
    wasDraggedRef,
  };
}
