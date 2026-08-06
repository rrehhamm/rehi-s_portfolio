import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/images/logo.png";
import { PORTFOLIO_NAME, PORTFOLIO_TAGLINE, LOADING_MESSAGES } from "../../utils/constants";
import "./SplashScreen.css";

const MESSAGE_INTERVAL = 420;

export default function SplashScreen({ onFinish }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMessageIndex((i) => Math.min(i + 1, LOADING_MESSAGES.length - 1));
    }, MESSAGE_INTERVAL);

    const finishTimer = setTimeout(() => {
      setLeaving(true);
    }, 2600);

    return () => {
      clearInterval(msgTimer);
      clearTimeout(finishTimer);
    };
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(onFinish, 400);
    return () => clearTimeout(t);
  }, [leaving, onFinish]);

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          className="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          role="status"
          aria-live="polite"
        >
          <motion.img
            src={logo}
            alt="The World of Rehi logo"
            className="splash__logo"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <motion.h1
            className="splash__title"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {PORTFOLIO_NAME}
          </motion.h1>
          <motion.p
            className="splash__subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {PORTFOLIO_TAGLINE}
          </motion.p>

          <div className="splash__message">
            <AnimatePresence mode="wait">
              <motion.span
                key={messageIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
              >
                {LOADING_MESSAGES[messageIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

          <button type="button" className="splash__skip" onClick={() => setLeaving(true)}>
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
