import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function MenuBarDropdown({ label, items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="menubar-dropdown" ref={ref}>
      <button
        type="button"
        className={`menubar-dropdown__trigger ${open ? "menubar-dropdown__trigger--open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {label}
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            className="menubar-dropdown__list"
            role="menu"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14 }}
          >
            {items.map((item, i) =>
              item.divider ? (
                <li key={`div-${i}`} className="menubar-dropdown__divider" role="separator" />
              ) : (
                <li key={item.label} role="none">
                  <button
                    type="button"
                    role="menuitem"
                    className="menubar-dropdown__item"
                    onClick={() => {
                      setOpen(false);
                      item.onSelect?.();
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              )
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
