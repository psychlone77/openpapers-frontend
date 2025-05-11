import { ThemeConfig, theme } from "antd";

const { defaultAlgorithm, darkAlgorithm } = theme;

export const lightTheme: ThemeConfig = {
  algorithm: defaultAlgorithm,
  token: {
    // Colors
    colorPrimary: "#6d28d9",
    colorSuccess: "#16a34a",
    colorWarning: "#f97316",
    colorError: "#dc2626",
    colorInfo: "#9333ea",

    // Background colors
    colorBgBase: "#ffffff",
    colorBgContainer: "#ffffff",
    colorBgElevated: "#f6eeff",
    colorBgLayout: "#ffffff",

    // Text colors
    colorText: "#171717",
    colorTextSecondary: "#484848",
    colorTextTertiary: "#6b7280",
    colorTextQuaternary: "#6b7280",

    // Border colors
    colorBorder: "#374151",
    colorBorderSecondary: "#c0aaf3",

    // Other tokens
    borderRadius: 6,
    fontFamily: "var(--font-geist-sans)",
  },
  components: {
    Button: {
      colorPrimary: "#6d28d9",
      algorithm: true,
    },
    Menu: {
      itemBg: "transparent",
      itemColor: "#171717",
      itemSelectedColor: "#6d28d9",
      itemSelectedBg: "#f6eeff",
      itemHoverColor: "#9333ea",
    },
    Layout: {
      algorithm: true,
      headerBg: "#ffffff",
    },
  },
};

export const darkTheme: ThemeConfig = {
  algorithm: darkAlgorithm,
  token: {
    // Colors
    colorPrimary: "#8b5cf6",
    colorSuccess: "#22c55e",
    colorWarning: "#fb923c",
    colorError: "#ef4444",
    colorInfo: "#a855f7",

    // Background colors
    colorBgBase: "#151b23",
    colorBgContainer: "#212830",
    colorBgElevated: "#212830",
    colorBgLayout: "#151b23",

    // Text colors
    colorText: "#d1d7e0",
    colorTextSecondary: "#edf4ff",
    colorTextTertiary: "#9ca3af",
    colorTextQuaternary: "#9ca3af",

    // Border colors
    colorBorder: "#e5e7eb",
    colorBorderSecondary: "#a78bfa",

    // Other tokens
    borderRadius: 6,
    fontFamily: "var(--font-geist-sans)",
  },
  components: {
    Button: {
      colorPrimary: "#8b5cf6",
      algorithm: true,
    },
    Menu: {
      itemBg: "transparent",
      itemColor: "#d1d7e0",
      itemSelectedColor: "#8b5cf6",
      itemSelectedBg: "#212830",
      itemHoverColor: "#a855f7",
    },
    Layout: {
      algorithm: true,
      headerBg: "#212830",
    },
  },
};
