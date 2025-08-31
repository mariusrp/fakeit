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

  // Background colors - much brighter
  background: {
    primary: "#1a1d29",
    secondary: "#242938",
    tertiary: "#2d3748",
    card: "rgba(255, 255, 255, 0.08)",
    cardBorder: "rgba(255, 255, 255, 0.15)",
    input: "rgba(255, 255, 255, 0.1)",
    inputFocused: "rgba(255, 255, 255, 0.15)",
    overlay: "rgba(0, 0, 0, 0.8)",
    modalBackdrop: "rgba(0, 0, 0, 0.6)",
  },

  // Text colors - improved contrast
  text: {
    primary: "#ffffff",
    secondary: "#d1d5db",
    tertiary: "#9ca3af",
    muted: "#6b7280",
    inverse: "#000000",
    accent: "#f3f4f6",
    placeholder: "#9ca3af",
  },

  // Game-specific colors - more vibrant
  game: {
    player1: "#60a5fa", // Brighter Blue
    player2: "#f87171", // Brighter Red
    player3: "#34d399", // Brighter Green
    player4: "#fbbf24", // Brighter Amber
    player5: "#a78bfa", // Brighter Purple
    player6: "#f472b6", // Brighter Pink
    player7: "#22d3ee", // Brighter Cyan
    player8: "#a3e635", // Brighter Lime

    correct: "#10b981",
    incorrect: "#ef4444",
    neutral: "#8b5cf6",
    pending: "#f59e0b",

    question: "#60a5fa",
    voting: "#a78bfa",
    results: "#34d399",

    winner: "#fbbf24",
    streak: "#f97316",
    bonus: "#06b6d4",
  },

  // Enhanced semantic colors
  success: {
    50: "rgba(16, 185, 129, 0.1)",
    100: "rgba(16, 185, 129, 0.15)",
    200: "rgba(16, 185, 129, 0.2)",
    300: "rgba(16, 185, 129, 0.3)",
    light: "rgba(16, 185, 129, 0.15)",
    border: "rgba(16, 185, 129, 0.4)",
    text: "#10b981",
    solid: "#10b981",
  },

  error: {
    50: "rgba(239, 68, 68, 0.1)",
    100: "rgba(239, 68, 68, 0.15)",
    200: "rgba(239, 68, 68, 0.2)",
    300: "rgba(239, 68, 68, 0.3)",
    light: "rgba(239, 68, 68, 0.15)",
    border: "rgba(239, 68, 68, 0.3)",
    text: "#ef4444",
    solid: "#ef4444",
  },

  warning: {
    50: "rgba(245, 158, 11, 0.1)",
    100: "rgba(245, 158, 11, 0.15)",
    200: "rgba(245, 158, 11, 0.2)",
    300: "rgba(245, 158, 11, 0.3)",
    light: "rgba(245, 158, 11, 0.15)",
    border: "rgba(245, 158, 11, 0.4)",
    text: "#f59e0b",
    solid: "#f59e0b",
  },

  info: {
    50: "rgba(96, 165, 250, 0.1)",
    100: "rgba(96, 165, 250, 0.15)",
    200: "rgba(96, 165, 250, 0.2)",
    300: "rgba(96, 165, 250, 0.3)",
    light: "rgba(96, 165, 250, 0.15)",
    border: "rgba(96, 165, 250, 0.4)",
    text: "#60a5fa",
    solid: "#60a5fa",
  },

  // Enhanced interactive colors
  interactive: {
    primary: "#60a5fa",
    primaryHover: "#3b82f6",
    primaryActive: "#2563eb",
    primaryDisabled: "rgba(96, 165, 250, 0.3)",

    secondary: "#8b5cf6",
    secondaryHover: "#7c3aed",
    secondaryActive: "#6d28d9",
    secondaryDisabled: "rgba(139, 92, 246, 0.3)",

    hover: "rgba(255, 255, 255, 0.15)",
    selected: "#60a5fa",
    selectedText: "#000000",
    disabled: "rgba(255, 255, 255, 0.08)",
    disabledText: "#6b7280",

    accent: "#a78bfa",
    accentHover: "#8b5cf6",
    danger: "#f87171",
    dangerHover: "#ef4444",
    success: "#34d399",
    successHover: "#10b981",
  },

  // Enhanced gradient colors - brighter
  gradients: {
    primary: ["#1e293b", "#334155", "#475569"],
    card: ["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.04)"],
    button: ["#60a5fa", "#3b82f6"],
    accent: ["#a78bfa", "#8b5cf6"],
    success: ["#34d399", "#10b981"],
    warning: ["#fbbf24", "#f59e0b"],
    error: ["#f87171", "#ef4444"],

    winner: ["#fbbf24", "#f59e0b"],
    correct: ["#34d399", "#10b981"],
    incorrect: ["#f87171", "#ef4444"],

    cardHover: ["rgba(255, 255, 255, 0.12)", "rgba(255, 255, 255, 0.06)"],
    modalOverlay: ["rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 0.9)"],
  },

  // Enhanced border colors
  border: {
    primary: "rgba(255, 255, 255, 0.15)",
    secondary: "rgba(255, 255, 255, 0.25)",
    focused: "rgba(255, 255, 255, 0.4)",
    success: "rgba(16, 185, 129, 0.4)",
    error: "rgba(239, 68, 68, 0.4)",
    warning: "rgba(245, 158, 11, 0.4)",
    info: "rgba(96, 165, 250, 0.4)",
    subtle: "rgba(255, 255, 255, 0.1)",
    prominent: "rgba(255, 255, 255, 0.3)",
  },

  // Enhanced shadow colors
  shadow: {
    light: "rgba(0, 0, 0, 0.1)",
    medium: "rgba(0, 0, 0, 0.2)",
    heavy: "rgba(0, 0, 0, 0.4)",
    colored: {
      primary: "rgba(96, 165, 250, 0.3)",
      success: "rgba(16, 185, 129, 0.3)",
      error: "rgba(239, 68, 68, 0.3)",
      warning: "rgba(245, 158, 11, 0.3)",
    },
    glow: {
      primary: "rgba(96, 165, 250, 0.5)",
      success: "rgba(16, 185, 129, 0.5)",
      error: "rgba(239, 68, 68, 0.5)",
      accent: "rgba(167, 139, 250, 0.5)",
    },
  },

  // Animation and transition colors
  animation: {
    fadeIn: "rgba(255, 255, 255, 0.1)",
    fadeOut: "rgba(255, 255, 255, 0.0)",
    shimmer: "rgba(255, 255, 255, 0.15)",
    pulse: "rgba(96, 165, 250, 0.2)",
  },

  // Accessibility enhancements
  accessibility: {
    focus: "#60a5fa",
    focusRing: "rgba(96, 165, 250, 0.5)",
    highContrast: "#ffffff",
    reducedMotion: "rgba(255, 255, 255, 0.8)",
  },

  // Theme variants
  variants: {
    dark: {
      background: "#1a1d29",
      surface: "#242938",
      text: "#ffffff",
    },
    light: {
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#1a1a1a",
    },
  },
} as const;

export const typography = {
  fonts: {
    primary: "System",
    secondary: "System",
    mono: "Courier New",
  },
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
    "5xl": 48,
  },
  weights: {
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
  letterSpacing: {
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
  },
} as const;

export const spacing = [
  0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96,
] as const;

export const borderRadius = {
  none: 0,
  sm: 2,
  base: 4,
  md: 6,
  lg: 8,
  xl: 12,
  "2xl": 16,
  "3xl": 24,
  full: 9999,
} as const;

export const shadows = {
  base: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
} as const;

export type Colors = typeof colors;
