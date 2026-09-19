import { useState, useEffect } from "react";

const STORAGE_KEY = "pf:darkMode";

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) return stored === "true";
      // Respeita preferência do sistema operacional
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem(STORAGE_KEY, String(isDark));
    } catch {
      // Ignora erros de localStorage em ambiente restrito
    }
  }, [isDark]);

  const toggle = () => setIsDark((prev) => !prev);
  const enable = () => setIsDark(true);
  const disable = () => setIsDark(false);

  return { isDark, toggle, enable, disable };
}

