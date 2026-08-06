import { AnimatePresence, motion } from "framer-motion";

/**
 * Mobile-only slide-out nav panel — used in place of the inline sidebar
 * when there's no room for a permanent one. Closes on backdrop click or via
 * the caller after a selection is made.
 */
export default function SidebarDrawer({ open, onClose, label, children }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="sidebar-drawer__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            className="split-view__sidebar split-view__sidebar--drawer"
            role="dialog"
            aria-label={label}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
