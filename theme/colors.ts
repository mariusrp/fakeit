export const colors = {
  // Primary palette
  primary: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },

  // Background colors
  background: {
    primary: "#0f0f0f",
    secondary: "#1a1a1a",
    tertiary: "#2a2a2a",
    card: "rgba(255, 255, 255, 0.03)",
    cardBorder: "rgba(255, 255, 255, 0.08)",
    input: "rgba(255, 255, 255, 0.05)",
    inputFocused: "rgba(255, 255, 255, 0.08)",
  },

  // Text colors
  text: {
    primary: "#ffffff",
    secondary: "#a0a0a0",
    tertiary: "#808080",
    muted: "#606060",
    inverse: "#000000",
  },

  // Semantic colors
  success: {
    light: "rgba(34, 197, 94, 0.15)",
    border: "rgba(34, 197, 94, 0.3)",
    text: "#22c55e",
  },

  error: {
    light: "rgba(239, 68, 68, 0.1)",
    border: "rgba(239, 68, 68, 0.2)",
    text: "#ef4444",
  },

  warning: {
    light: "rgba(251, 191, 36, 0.15)",
    border: "rgba(251, 191, 36, 0.3)",
    text: "#fbbf24",
  },

  info: {
    light: "rgba(59, 130, 246, 0.15)",
    border: "rgba(59, 130, 246, 0.3)",
    text: "#3b82f6",
  },

  // Interactive colors
  interactive: {
    hover: "rgba(255, 255, 255, 0.1)",
    selected: "#ffffff",
    selectedText: "#000000",
    disabled: "rgba(255, 255, 255, 0.05)",
    disabledText: "#606060",
  },

  // Gradient colors
  gradients: {
    primary: ["#0a0a0a", "#1a1a1a", "#0a0a0a"],
    card: ["rgba(255, 255, 255, 0.03)", "rgba(255, 255, 255, 0.01)"],
  },

  // Border colors
  border: {
    primary: "rgba(255, 255, 255, 0.08)",
    secondary: "rgba(255, 255, 255, 0.15)",
    focused: "rgba(255, 255, 255, 0.3)",
  },

  // Shadow colors
  shadow: {
    light: "rgba(0, 0, 0, 0.1)",
    medium: "rgba(0, 0, 0, 0.2)",
    heavy: "rgba(0, 0, 0, 0.4)",
  },
} as const;

export type Colors = typeof colors;
