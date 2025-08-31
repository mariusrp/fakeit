import React, { useState } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from "react-native";
import { colors, typography, spacing, borderRadius } from "../../theme";

interface InputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  containerStyle,
  inputStyle,
  labelStyle,
  required = false,
  leftIcon,
  rightIcon,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    textInputProps.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    textInputProps.onBlur?.(e);
  };

  const getInputContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      backgroundColor: colors.background.input,
      borderColor: colors.border.primary,
    };

    if (isFocused) {
      return {
        ...baseStyle,
        backgroundColor: colors.background.inputFocused,
        borderColor: colors.border.focused,
      };
    }

    if (error) {
      return {
        ...baseStyle,
        borderColor: colors.error.border,
        backgroundColor: colors.error.light,
      };
    }

    return baseStyle;
  };

  const getInputStyle = (): TextStyle => {
    return {
      flex: 1,
      fontFamily: typography.fonts.secondary,
      fontSize: typography.sizes.base,
      fontWeight: typography.weights.normal,
      color: colors.text.primary,
      paddingHorizontal: leftIcon || rightIcon ? spacing[2] : 0,
    };
  };

  const getLabelStyle = (): TextStyle => {
    return {
      fontFamily: typography.fonts.secondary,
      fontSize: typography.sizes.sm,
      fontWeight: typography.weights.medium,
      color: colors.text.secondary,
      marginBottom: spacing[2],
    };
  };

  const getHelperTextStyle = (): TextStyle => {
    return {
      fontFamily: typography.fonts.secondary,
      fontSize: typography.sizes.xs,
      fontWeight: typography.weights.normal,
      color: error ? colors.error.text : colors.text.tertiary,
      marginTop: spacing[1],
    };
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[getLabelStyle(), labelStyle]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <View style={getInputContainerStyle()}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

        <TextInput
          {...textInputProps}
          style={[getInputStyle(), inputStyle]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={colors.text.tertiary}
          selectionColor={colors.text.primary}
        />

        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>

      {(error || helperText) && (
        <Text style={getHelperTextStyle()}>{error || helperText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
  },
  required: {
    color: colors.error.text,
  },
  iconContainer: {
    marginHorizontal: spacing[1],
  },
});
