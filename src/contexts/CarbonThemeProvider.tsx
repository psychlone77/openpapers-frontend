"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type CarbonThemeMode = "white" | "g10" | "g90" | "g100";

interface CarbonThemeContextType {
  theme: CarbonThemeMode;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: CarbonThemeMode) => void;
}

const CarbonThemeContext = createContext<CarbonThemeContextType | undefined>(undefined);

const THEME_CLASSES = ["cds--white", "cds--g10", "cds--g90", "cds--g100"] as const;

function applyThemeToDOM(theme: CarbonThemeMode) {
  if (typeof document === "undefined") return;

  document.documentElement.setAttribute("data-carbon-theme", theme);
  document.documentElement.classList.remove(...THEME_CLASSES);
  document.documentElement.classList.add(`cds--${theme}`);

  if (document.body) {
    document.body.setAttribute("data-carbon-theme", theme);
    document.body.classList.remove(...THEME_CLASSES);
    document.body.classList.add(`cds--${theme}`);
  }
}

export function CarbonThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setCurrentTheme] = useState<CarbonThemeMode>("white");

  // Sync React state with the theme already applied to <html> by the blocking head script
  useEffect(() => {
    try {
      const domTheme = document.documentElement.getAttribute(
        "data-carbon-theme"
      ) as CarbonThemeMode | null;
      const saved = localStorage.getItem("openpapers-theme") as CarbonThemeMode | null;
      const resolved: CarbonThemeMode =
        saved && ["white", "g10", "g90", "g100"].includes(saved)
          ? saved
          : domTheme && ["white", "g10", "g90", "g100"].includes(domTheme)
            ? domTheme
            : window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "g100"
              : "white";

      setCurrentTheme(resolved);
      applyThemeToDOM(resolved);
      localStorage.setItem("openpapers-theme", resolved);
    } catch {
      // Ignore storage errors in private browsing
    }
  }, []);

  const isDarkMode = theme === "g90" || theme === "g100";

  const toggleTheme = () => {
    const nextTheme: CarbonThemeMode = isDarkMode ? "white" : "g100";
    setCurrentTheme(nextTheme);
    applyThemeToDOM(nextTheme);
    try {
      localStorage.setItem("openpapers-theme", nextTheme);
    } catch {
      // Ignore
    }
  };

  const setTheme = (newTheme: CarbonThemeMode) => {
    setCurrentTheme(newTheme);
    applyThemeToDOM(newTheme);
    try {
      localStorage.setItem("openpapers-theme", newTheme);
    } catch {
      // Ignore
    }
  };

  return (
    <CarbonThemeContext.Provider value={{ theme, isDarkMode, toggleTheme, setTheme }}>
      <div className="min-h-screen">{children}</div>
    </CarbonThemeContext.Provider>
  );
}

export function useCarbonTheme() {
  const context = useContext(CarbonThemeContext);
  if (!context) {
    throw new Error("useCarbonTheme must be used within a CarbonThemeProvider");
  }
  return context;
}
