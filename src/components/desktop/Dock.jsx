import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useWindowManager } from "../../context/WindowManagerContext";
import { useTheme } from "../../context/ThemeContext";
import { useDesktopLayout } from "../../context/DesktopLayoutContext";
import { useDock } from "../../context/DockContext";
import { getIcon } from "../../utils/iconMap";
import { DOCK_ITEMS } from "../../utils/constants";
import "./Dock.css";

const REVEAL_ZONE_PX = 56; // distance from the bottom edge that counts as "near the dock"
const HIDE_DELAY_MS = 300; // brief grace period so the dock doesn't flicker when the mouse just grazes past

export default function Dock() {
  const { windows, activeId, openWindow, restoreWindow, toggleWindow } = useWindowManager();
  const { theme, setTheme } = useTheme();
  const { setWidgetVisible } = useDesktopLayout();
  const { autoHideActive, isMobile } = useDock();
  const [mouseNear, setMouseNear] = useState(false);
  const hideTimerRef = useRef(null);

  const reveal = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setMouseNear(true);
  }, []);

  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current) return;
    hideTimerRef.current = setTimeout(() => {
      hideTimerRef.current = null;
      setMouseNear(false);
    }, HIDE_DELAY_MS);
  }, []);

  // Two ways in: the mouse reaching the physical bottom edge of the screen
  // brings the dock up; once it's up, hovering the dock itself (which now
  // extends well above that edge) keeps it up via onPointerEnter below.
  useEffect(() => {
    if (!autoHideActive) {
      setMouseNear(false);
      return undefined;
    }
    const onMove = (e) => {
      const distanceFromBottom = window.innerHeight - e.clientY;
      if (distanceFromBottom <= REVEAL_ZONE_PX) reveal();
      else scheduleHide();
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [autoHideActive, reveal, scheduleHide]);

  const hidden = autoHideActive && !mouseNear;

  const handleClick = (id) => {
    if (id === "welcome") {
      setWidgetVisible("welcome", true);
      return;
    }
    const w = windows[id];
    if (w?.isOpen && w.minimized) {
      restoreWindow(id);
      return;
    }
    if (w?.isOpen) {
      toggleWindow(id);
      return;
    }
    openWindow(id);
  };

  return (
    <nav
      className={`dock ${isMobile ? "dock--mobile" : ""} ${hidden ? "dock--hidden" : ""}`}
      aria-label={isMobile ? "Navigation" : "Dock"}
      onPointerEnter={autoHideActive ? reveal : undefined}
      onPointerLeave={autoHideActive ? scheduleHide : undefined}
    >
      <ul className="dock__list">
        {DOCK_ITEMS.map((item) => {
          const Icon = getIcon(item.icon);
          const w = windows[item.id];
          const isOpen = w?.isOpen && !w.minimized;
          const isMinimized = w?.isOpen && w.minimized;
          const isActive = activeId === item.id && isOpen;
          return (
            <li key={item.id} className="dock__item-wrap">
              <motion.button
                type="button"
                className={`dock__item ${isActive ? "dock__item--active" : ""}`}
                whileHover={{ scale: 1.18, y: -6 }}
                whileTap={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                onClick={() => handleClick(item.id)}
                aria-label={item.label}
                title={item.label}
              >
                <Icon size={20} strokeWidth={1.8} />
              </motion.button>
              {(isOpen || isMinimized) && <span className="dock__indicator" aria-hidden="true" />}
            </li>
          );
        })}
        <li className="dock__divider" aria-hidden="true" />
        <li className="dock__item-wrap">
          <motion.button
            type="button"
            className="dock__item"
            whileHover={{ scale: 1.18, y: -6 }}
            whileTap={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === "light" ? <Moon size={19} strokeWidth={1.8} /> : <Sun size={19} strokeWidth={1.8} />}
          </motion.button>
        </li>
      </ul>
    </nav>
  );
}
