import { motion, AnimatePresence } from "framer-motion";
import "./FirstVisitTooltip.css";

export default function FirstVisitTooltip({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
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
