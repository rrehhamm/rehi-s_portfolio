import { createContext, useContext, useEffect, useCallback } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage("rehi-theme", "light");
  const [reduceMotion, setReduceMotion] = useLocalStorage("rehi-reduce-motion", false);
  // null = no explicit choice yet — the dock decides for itself based on
  // whether a maximized/very tall window is open. "always" / "auto" are
  // explicit user overrides set from Settings.
  const [dockMode, setDockMode] = useLocalStorage("dockMode", null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-reduce-motion", String(reduceMotion));
  }, [reduceMotion]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, [setTheme]);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, toggleTheme, reduceMotion, setReduceMotion, dockMode, setDockMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
