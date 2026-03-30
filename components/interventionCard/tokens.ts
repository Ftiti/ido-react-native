
const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: "#0a7ea4",
    icon: "#687076",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: "#0a7ea4",
    icon: "#9BA1A6",
  },
};

export const makeTokens = (scheme: "light" | "dark") => {
  const isDark = scheme === "dark";
  return {
    green: "#22c55e",
    yellow: "#f59e0b",
    red: "#ef4444",
    pageBg: isDark ? "#0f1112" : "#eef2f7",
    cardBg: isDark ? "#1e2124" : "#ffffff",
    cardBorder: isDark ? "#2a2d31" : "transparent",
    text: Colors[scheme].text,
    subText: isDark ? "#9BA1A6" : "#64748b",
    primary: "#2563eb",
    primaryLight: isDark ? "#1e3a6e" : "#dbeafe",
    primaryText: isDark ? "#93c5fd" : "#2563eb",
    border: isDark ? "#2a2d31" : "#e2e8f0",
    avatarBorder: isDark ? "#2a2d31" : "#e2e8f0",
    avatarBg: isDark ? "#1e3a6e" : "#dbeafe",
    toggleBg: isDark ? "#252930" : "#f8fafc",
    toggleBorder: isDark ? "#3b4451" : "#cbd5e1",
    toggleText: isDark ? "#93c5fd" : "#2563eb",
    toggleDots: isDark ? "#93c5fd" : "#2563eb",
    shadowColor: isDark ? "#000000" : "#1e3a5f",
  };
};

export type Tokens = ReturnType<typeof makeTokens>;
