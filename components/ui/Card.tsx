import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, spacing, borderRadius, shadows } from "../../theme";

interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "outlined";
  padding?: keyof typeof spacing;
  style?: ViewStyle;
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  padding = 6,
  style,
  gradient = false,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius["2xl"],
      padding: spacing[padding],
      position: "relative",
      overflow: "hidden",
    };

    const variantStyles: Record<string, ViewStyle> = {
      default: {
        backgroundColor: colors.background.card,
        borderWidth: 1,
        borderColor: colors.background.cardBorder,
        ...shadows.md,
      },
      elevated: {
        backgroundColor: colors.background.card,
        borderWidth: 1,
        borderColor: colors.background.cardBorder,
        ...shadows.lg,
      },
      outlined: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: colors.border.secondary,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
    };
  };

  if (gradient) {
    return (
      <View style={[getCardStyle(), style]}>
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.03)", "rgba(255, 255, 255, 0.01)"]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.topBorder} />
        {children}
      </View>
    );
  }

  return (
    <View style={[getCardStyle(), style]}>
      <View style={styles.topBorder} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  topBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
});
