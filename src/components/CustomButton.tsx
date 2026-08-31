import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

import colors from "../constants/colors";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "outline";
  style?: ViewStyle;
}

const CustomButton = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  style,
}: CustomButtonProps) => {
  const isDisabled = disabled || loading;
  const isOutline = variant === "outline";

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        isOutline && styles.outlineButton,
        isDisabled && styles.disabledButton,
        pressed && !isDisabled && styles.pressedButton,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={isOutline ? colors.primary : colors.white}
        />
      ) : (
        <Text
          style={[
            styles.text,
            isOutline && styles.outlineText,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  outlineButton: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },

  disabledButton: {
    opacity: 0.6,
  },

  pressedButton: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },

  outlineText: {
    color: colors.primary,
  },
});