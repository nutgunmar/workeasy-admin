// src/context/SettingsContext.tsx
"use client";

import { ConfigProvider, theme } from "antd";
import React, { createContext, useContext, useEffect, useState } from "react";

interface Settings {
  appName: string;
  logoUrl: string;
  fontSize: number;
  sidebarWidth: number;
  appThemeMode: "light" | "dark";
  colorPrimary: string;
}

const defaultSettings: Settings = {
  appName: "แอปเครื่องมือ",
  logoUrl: "",
  fontSize: 14,
  sidebarWidth: 200,
  appThemeMode: "dark",
  colorPrimary: "#1890ff",
};

const SettingsContext = createContext<{
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}>({
  settings: defaultSettings,
  updateSettings: () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const stored = localStorage.getItem("appSettings");
    if (stored) {
      const parsed = JSON.parse(stored);
      const colorPrimary =
        typeof parsed.colorPrimary === "string" &&
        parsed.colorPrimary.startsWith("#")
          ? parsed.colorPrimary
          : defaultSettings.colorPrimary;
      const updatedSettings = {
        ...defaultSettings,
        ...parsed,
        colorPrimary,
      };
      setSettings(updatedSettings);
      applyCssVariables(updatedSettings);
    } else {
      applyCssVariables(defaultSettings);
    }
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    const colorPrimary = newSettings.colorPrimary
      ? typeof newSettings.colorPrimary === "string"
        ? newSettings.colorPrimary
        : (newSettings.colorPrimary as any).toHexString?.() ||
          defaultSettings.colorPrimary
      : settings.colorPrimary;

    const updated = {
      ...settings,
      ...newSettings,
      colorPrimary,
    };
    setSettings(updated);
    localStorage.setItem("appSettings", JSON.stringify(updated));
    applyCssVariables(updated);
  };

  const applyCssVariables = (s: Settings) => {
    document.documentElement.style.setProperty(
      "--background",
      s.appThemeMode === "dark" ? "#0a0a0a" : "#ffffff"
    );
    document.documentElement.style.setProperty(
      "--foreground",
      s.appThemeMode === "dark" ? "#ffffff" : "#171717"
    );
    document.documentElement.style.setProperty(
      "--color-primary",
      s.colorPrimary || defaultSettings.colorPrimary
    );
    document.documentElement.style.setProperty(
      "--color-primary-hover",
      lightenColor(s.colorPrimary || defaultSettings.colorPrimary, 20)
    );
    document.documentElement.style.setProperty(
      "--font-size",
      `${s.fontSize}px`
    );
  };

  const lightenColor = (hex: string, percent: number) => {
    if (!hex || typeof hex !== "string" || !hex.startsWith("#")) {
      console.warn(`Invalid hex color: ${hex}, using default color #1890ff`);
      hex = "#1890ff";
    }
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return `#${(
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
      .padStart(6, "0")}`;
  };

  const themeConfig = {
    algorithm:
      settings.appThemeMode === "dark"
        ? theme.darkAlgorithm
        : theme.defaultAlgorithm,
    token: {
      fontSize: settings.fontSize,
      colorPrimary: settings.colorPrimary || defaultSettings.colorPrimary,
      colorTextBase: settings.appThemeMode === "dark" ? "#ffffff" : "#171717",
      colorBgBase: settings.appThemeMode === "dark" ? "#0a0a0a" : "#ffffff",
      colorText: settings.appThemeMode === "dark" ? "#ffffff" : "#171717",
    },
    components: {
      Menu: {
        itemSelectedColor: "#ffffff", // สีข้อความเมนูที่เลือก
        itemSelectedBg: settings.colorPrimary || defaultSettings.colorPrimary, // พื้นหลังเมนูที่เลือก
        itemHoverColor: "#ffffff", // สีข้อความเมื่อ hover
        itemHoverBg: lightenColor(
          settings.colorPrimary || defaultSettings.colorPrimary,
          20
        ), // พื้นหลังเมื่อ hover
        itemColor: settings.appThemeMode === "dark" ? "#ffffff" : "#171717", // สีข้อความทั่วไป
      },
    },
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
