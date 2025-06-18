"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ConfigProvider } from "antd";
import { lightTheme, darkTheme } from "@/theme/theme";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const token = isDarkMode ? darkTheme.token : lightTheme.token;
    if (!token) return;
    document.documentElement.style.setProperty("--ant-color-bg-base", token.colorBgBase ?? "");
    document.documentElement.style.setProperty(
      "--ant-color-bg-container",
      token.colorBgContainer ?? ""
    );
    document.documentElement.style.setProperty("--ant-color-text", token.colorText ?? "");
  }, [isDarkMode]);

  useEffect(() => {
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme");
    const initialTheme = savedTheme ? savedTheme === "dark" : systemPrefersDark;

    setIsDarkMode(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? "dark" : "light";
    setIsDarkMode(!isDarkMode);
    // document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ConfigProvider theme={isDarkMode ? darkTheme : lightTheme}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
