import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./FirstVisitTooltip.css";

// Auto-dismiss delay: the tip disappears on its own shortly after showing,
// even if the visitor never opens a folder — it shouldn't linger forever.
const AUTO_DISMISS_MS = 4500;

export default function FirstVisitTooltip({ visible }) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!visible) return undefined;
    const timer = setTimeout(() => setDismissed(true), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [visible]);

  const shown = visible && !dismissed;

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          className="first-visit-tip"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          role="status"
        >
          Double click any folder to explore my world.
        </motion.div>
      )}
    </AnimatePresence>
  );
}
