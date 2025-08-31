import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "../../theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  haptic?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
  textStyle,
  haptic = true,
}) => {
  const handlePress = () => {
    if (disabled || loading) return;

    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    onPress();
  };

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius.md,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      ...shadows.base,
    };

    // Size styles
    const sizeStyles: Record<string, ViewStyle> = {
      small: {
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[2],
        minHeight: 36,
      },
      medium: {
        paddingHorizontal: spacing[6],
        paddingVertical: spacing[4],
        minHeight: 48,
      },
      large: {
        paddingHorizontal: spacing[8],
        paddingVertical: spacing[5],
        minHeight: 56,
      },
    };

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: colors.interactive.selected,
      },
      secondary: {
        backgroundColor: colors.background.input,
        borderWidth: 1,
        borderColor: colors.border.secondary,
      },
      success: {
        backgroundColor: colors.success.text,
      },
      warning: {
        backgroundColor: colors.warning.text,
      },
      danger: {
        backgroundColor: colors.error.text,
      },
    };

    const disabledStyle: ViewStyle =
      disabled || loading
        ? {
            backgroundColor: colors.interactive.disabled,
            borderColor: colors.border.primary,
          }
        : {};

    const fullWidthStyle: ViewStyle = fullWidth ? { width: "100%" } : {};

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...disabledStyle,
      ...fullWidthStyle,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontFamily: typography.fonts.primary,
      fontWeight: typography.weights.medium,
      textAlign: "center",
    };

    // Size text styles
    const sizeTextStyles: Record<string, TextStyle> = {
      small: {
        fontSize: typography.sizes.sm,
      },
      medium: {
        fontSize: typography.sizes.base,
      },
      large: {
        fontSize: typography.sizes.lg,
      },
    };

    // Variant text styles
    const variantTextStyles: Record<string, TextStyle> = {
      primary: {
        color: colors.text.inverse,
      },
      secondary: {
        color: colors.text.primary,
      },
      success: {
        color: colors.text.primary,
      },
      warning: {
        color: colors.text.inverse,
      },
      danger: {
        color: colors.text.primary,
      },
    };

    const disabledTextStyle: TextStyle =
      disabled || loading
        ? {
            color: colors.interactive.disabledText,
          }
        : {};

    return {
      ...baseTextStyle,
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
      ...disabledTextStyle,
    };
  };

  const buttonStyle = getButtonStyle();
  const textStyleFinal = getTextStyle();

  if (variant === "primary" && !disabled && !loading) {
    return (
      <TouchableOpacity
        style={[buttonStyle, style]}
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        {loading && (
          <ActivityIndicator
            size="small"
            color={colors.text.inverse}
            style={{ marginRight: spacing[2] }}
          />
        )}
        <Text style={[textStyleFinal, textStyle]}>{title}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[buttonStyle, style]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={
            variant === "primary" ? colors.text.inverse : colors.text.primary
          }
          style={{ marginRight: spacing[2] }}
        />
      )}
      <Text style={[textStyleFinal, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Additional styles can be added here if needed
});
