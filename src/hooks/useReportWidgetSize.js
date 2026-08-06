import { useEffect } from "react";
import { useDesktopLayout } from "../context/DesktopLayoutContext";

/** Keeps DesktopLayoutContext's collision math in sync with a widget's real rendered size. */
export function useReportWidgetSize(widgetId, ref) {
  const { setWidgetSize } = useDesktopLayout();

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const report = () => {
      const rect = node.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setWidgetSize(widgetId, { width: Math.round(rect.width), height: Math.round(rect.height) });
      }
    };

    report();
    const observer = new ResizeObserver(report);
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, widgetId, setWidgetSize]);
}
