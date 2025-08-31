import { Platform } from "react-native";

export const typography = {
  fonts: {
    primary: Platform.select({
      ios: "SF Pro Display",
      android: "Roboto",
      default: "System",
    }),
    secondary: Platform.select({
      ios: "SF Pro Text",
      android: "Roboto",
      default: "System",
    }),
    mono: Platform.select({
      ios: "SF Mono",
      android: "Roboto Mono",
      default: "monospace",
    }),
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
    "6xl": 60,
    "7xl": 72,
  },
  weights: {
    light: "300" as const,
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
    extrabold: "800" as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
  letterSpacing: {
    tight: -0.02,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
  },
} as const;

export type Typography = typeof typography;
