import { AnimatePresence, motion } from "framer-motion";
import { Award, Info } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import "./ToastContainer.css";

export default function ToastContainer() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            className={`toast toast--${t.type}`}
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            onClick={() => dismiss(t.id)}
            role="status"
          >
            {t.type === "achievement" ? <Award size={16} /> : <Info size={16} />}
            <span>{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
