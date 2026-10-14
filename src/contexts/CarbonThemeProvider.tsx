"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Theme } from "@carbon/react";

export type CarbonThemeMode = "white" | "g10" | "g90" | "g100";

interface CarbonThemeContextType {
  theme: CarbonThemeMode;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: CarbonThemeMode) => void;
}

const CarbonThemeContext = createContext<CarbonThemeContextType | undefined>(undefined);

export function CarbonThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setCurrentTheme] = useState<CarbonThemeMode>("white");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("openpapers-theme") as CarbonThemeMode | null;
    if (savedTheme && ["white", "g10", "g90", "g100"].includes(savedTheme)) {
      setCurrentTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setCurrentTheme(prefersDark ? "g100" : "white");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-carbon-theme", theme);
    document.body.setAttribute("data-carbon-theme", theme);
    localStorage.setItem("openpapers-theme", theme);
  }, [theme, mounted]);

  const isDarkMode = theme === "g90" || theme === "g100";

  const toggleTheme = () => {
    const nextTheme: CarbonThemeMode = isDarkMode ? "white" : "g100";
    setCurrentTheme(nextTheme);
  };

  const setTheme = (newTheme: CarbonThemeMode) => {
    setCurrentTheme(newTheme);
  };

  return (
    <CarbonThemeContext.Provider value={{ theme, isDarkMode, toggleTheme, setTheme }}>
      <Theme theme={theme}>
        <div data-carbon-theme={theme} className="min-h-screen">
          {children}
        </div>
      </Theme>
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
