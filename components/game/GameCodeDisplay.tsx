import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography, spacing, borderRadius } from "../../theme";

interface GameCodeDisplayProps {
  gameCode: string;
  variant?: "floating" | "card";
}

export const GameCodeDisplay: React.FC<GameCodeDisplayProps> = ({
  gameCode,
  variant = "card",
}) => {
  if (variant === "floating") {
    return (
      <View style={styles.floatingContainer}>
        <Text style={styles.floatingText}>Spillkode: {gameCode}</Text>
      </View>
    );
  }

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.label}>Spillkode</Text>
      <Text style={styles.code}>{gameCode}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: "absolute",
    top: spacing[12],
    right: spacing[4],
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.base,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    zIndex: 1000,
  },
  floatingText: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: "rgba(255, 255, 255, 0.6)",
  },
  cardContainer: {
    backgroundColor: colors.background.input,
    borderWidth: 1,
    borderColor: colors.border.primary,
    padding: spacing[6],
    borderRadius: borderRadius.lg,
    marginBottom: spacing[6],
    alignItems: "center",
  },
  label: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.text.tertiary,
    textTransform: "uppercase",
    letterSpacing: typography.letterSpacing.wide,
    marginBottom: spacing[2],
  },
  code: {
    fontFamily: typography.fonts.mono,
    fontSize: typography.sizes["4xl"],
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    letterSpacing: typography.letterSpacing.wider,
  },
});
