import { createContext, useContext, useCallback, useState, useRef } from "react";

const ToastContext = createContext(null);
let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((toast) => toast.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const showToast = useCallback((message, options = {}) => {
    const id = ++idCounter;
    const toast = { id, message, type: options.type || "info", icon: options.icon };
    setToasts((t) => [...t, toast]);
    timers.current[id] = setTimeout(() => dismiss(id), options.duration || 2800);
    return id;
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
