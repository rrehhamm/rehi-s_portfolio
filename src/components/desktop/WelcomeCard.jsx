import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, GripHorizontal } from "lucide-react";
import { useWindowManager } from "../../context/WindowManagerContext";
import { useDesktopLayout } from "../../context/DesktopLayoutContext";
import { useDraggableWidget } from "../../hooks/useDraggableWidget";
import { useReportWidgetSize } from "../../hooks/useReportWidgetSize";
import { useIsMobile } from "../../hooks/useMediaQuery";
import "./WelcomeCard.css";

export default function WelcomeCard() {
  const { openWindow } = useWindowManager();
  const { welcome, setWidgetVisible } = useDesktopLayout();
  const { dragHandleProps, dragging, position } = useDraggableWidget("welcome", welcome);
  const isMobile = useIsMobile();
  const cardRef = useRef(null);
  useReportWidgetSize("welcome", cardRef);

  const style = isMobile ? undefined : { left: position.x, top: position.y };

  return (
    <AnimatePresence>
      {welcome.visible && (
        <motion.aside
          ref={cardRef}
          className={`welcome-card ${dragging ? "welcome-card--dragging" : ""}`}
          style={style}
          initial={{ opacity: 0, y: -14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          role="complementary"
          aria-label="Welcome"
        >
          {!isMobile && (
            <div className="welcome-card__handle" {...dragHandleProps} aria-hidden="true">
              <GripHorizontal size={14} />
            </div>
          )}
          <button type="button" className="welcome-card__close" onClick={() => setWidgetVisible("welcome", false)} aria-label="Close welcome card">
            <X size={14} />
          </button>
          <p className="welcome-card__greeting">Hi, I'm Reham ⋆˚꩜｡</p>
          <p className="welcome-card__roles">Software Engineer · QA Enthusiast · UI/UX Designer</p>
          <div className="welcome-card__actions">
            <button type="button" className="welcome-card__btn welcome-card__btn--primary" onClick={() => openWindow("projects")}>
              Explore My Work
            </button>
            <button type="button" className="welcome-card__btn" onClick={() => openWindow("resume")}>
              Open Resume
            </button>
          </div>
          <div className="welcome-card__status">
            <span className="welcome-card__status-dot" />
            Open to internships
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
