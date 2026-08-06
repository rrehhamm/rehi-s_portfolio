import { useRef } from "react";
import { motion } from "framer-motion";
import { MacFolderIcon, FileIcon } from "../shared/FolderIcon";
import { useIsMobile, useIsTablet } from "../../hooks/useMediaQuery";
import { useDraggableIcon } from "../../hooks/useDraggableIcon";
import "./DesktopIcon.css";

export default function DesktopIcon({ icon, selected, onSelect, onOpen, position, displaced }) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const glyphSize = isMobile ? 40 : isTablet ? 42 : 44;
  const lastTap = useRef(0);
  const { dragHandleProps, dragging, position: dragPosition, wasDraggedRef } = useDraggableIcon(icon.id, position);

  const handleClick = () => {
    // A pointerdown that turned into a drag still fires a trailing click —
    // swallow just that one so dragging an icon never also "opens" it.
    if (wasDraggedRef.current) {
      wasDraggedRef.current = false;
      return;
    }
    onSelect();
    if (isMobile) {
      const now = Date.now();
      if (now - lastTap.current < 500) {
        onOpen();
      } else {
        onOpen();
      }
      lastTap.current = now;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  };

  const animatedStyle = dragPosition ? { left: dragPosition.x, top: dragPosition.y } : undefined;

  return (
    <motion.button
      type="button"
      className={`desktop-icon ${selected ? "desktop-icon--selected" : ""} ${displaced ? "desktop-icon--displaced" : ""} ${position ? "desktop-icon--positioned" : ""} ${dragging ? "desktop-icon--dragging" : ""}`}
      onClick={handleClick}
      onDoubleClick={() => !isMobile && onOpen()}
      onKeyDown={handleKeyDown}
      style={position ? { position: "absolute" } : undefined}
      animate={animatedStyle}
      transition={dragging ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 26 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      aria-label={`${icon.label}${icon.kind === "locked" ? " (locked folder)" : ""} — double click to open, drag to move`}
      {...dragHandleProps}
    >
      <span className="desktop-icon__glyph">
        {icon.kind === "file" ? <FileIcon size={glyphSize} /> : <MacFolderIcon size={glyphSize} locked={icon.kind === "locked"} />}
      </span>
      <span className="desktop-icon__label">{icon.label}</span>
    </motion.button>
  );
}
