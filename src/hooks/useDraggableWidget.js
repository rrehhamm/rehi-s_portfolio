import { useState, useRef, useCallback, useEffect } from "react";
import { useDesktopLayout } from "../context/DesktopLayoutContext";
import { useIsMobile } from "./useMediaQuery";
import { clampWidgetToDesktop } from "../utils/layoutMath";

/**
 * Makes a desktop widget draggable from a dedicated handle element.
 * Position lives in DesktopLayoutContext; this hook only owns the transient
 * "currently being dragged" position so drag frames don't thrash the wider
 * icon-layout recalculation until the drag actually ends.
 */
export function useDraggableWidget(widgetId, widget) {
  const { bounds, updateDragPreview, clearDragPreview, commitWidgetPosition } = useDesktopLayout();
  const isMobile = useIsMobile();
  const [dragging, setDragging] = useState(false);
  const [livePosition, setLivePosition] = useState(widget.position);
  const dragRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!dragging) setLivePosition(widget.position);
  }, [widget.position, dragging]);

  const handlePointerDown = useCallback((e) => {
    if (isMobile) return;
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    const startPos = { ...widget.position };
    dragRef.current = { startX: e.clientX, startY: e.clientY, startPos, next: startPos };
    setDragging(true);

    const onMove = (ev) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = ev.clientX - drag.startX;
      const dy = ev.clientY - drag.startY;
      const next = clampWidgetToDesktop({ x: drag.startPos.x + dx, y: drag.startPos.y + dy }, widget.size, bounds);
      drag.next = next;
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        setLivePosition(next);
        updateDragPreview(widgetId, next, widget.size);
      });
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      const finalPos = dragRef.current?.next || widget.position;
      dragRef.current = null;
      setDragging(false);
      clearDragPreview();
      commitWidgetPosition(widgetId, finalPos);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }, [isMobile, widget, bounds, widgetId, updateDragPreview, clearDragPreview, commitWidgetPosition]);

  return {
    dragHandleProps: isMobile ? {} : { onPointerDown: handlePointerDown },
    dragging,
    position: dragging ? livePosition : widget.position,
  };
}
