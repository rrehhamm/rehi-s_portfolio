import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ImageOff, Loader2 } from "lucide-react";
import "./Lightbox.css";

export default function Lightbox({ items, index, onClose, onNavigate }) {
  const [loaded, setLoaded] = useState(false);
  const item = items[index];

  const goPrev = useCallback(() => {
    setLoaded(false);
    onNavigate((index - 1 + items.length) % items.length);
  }, [index, items.length, onNavigate]);

  const goNext = useCallback(() => {
    setLoaded(false);
    onNavigate((index + 1) % items.length);
  }, [index, items.length, onNavigate]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, goPrev, goNext]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={item.title || "Image preview"}
      >
        <button type="button" className="lightbox__close" onClick={onClose} aria-label="Close preview">
          <X size={18} />
        </button>

        {items.length > 1 && (
          <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={(e) => { e.stopPropagation(); goPrev(); }} aria-label="Previous image">
            <ChevronLeft size={22} />
          </button>
        )}

        <motion.div
          className="lightbox__stage"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {item.src ? (
            <>
              {!loaded && <Loader2 className="lightbox__spinner" size={26} />}
              <img
                src={item.src}
                alt={item.title || ""}
                className="lightbox__img"
                style={{ display: loaded ? "block" : "none" }}
                onLoad={() => setLoaded(true)}
                onError={() => setLoaded(true)}
              />
            </>
          ) : (
            <div className="lightbox__fallback">
              <ImageOff size={36} strokeWidth={1.3} />
              <span>Image coming soon</span>
            </div>
          )}
          {(item.title || item.caption) && (
            <div className="lightbox__caption">
              {item.title && <strong>{item.title}</strong>}
              {item.caption && <span>{item.caption}</span>}
            </div>
          )}
        </motion.div>

        {items.length > 1 && (
          <button type="button" className="lightbox__nav lightbox__nav--next" onClick={(e) => { e.stopPropagation(); goNext(); }} aria-label="Next image">
            <ChevronRight size={22} />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
