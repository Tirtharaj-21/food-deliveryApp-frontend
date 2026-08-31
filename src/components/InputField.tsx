import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import colors from "../constants/colors";

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  touched?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
}

const InputField = ({
  label,
  error,
  touched,
  leftIcon,
  ...textInputProps
}: InputFieldProps) => {
  const showError = Boolean(touched && error);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.inputContainer,
          showError && styles.inputError,
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={colors.textSecondary}
            style={styles.icon}
          />
        )}

        <TextInput
          {...textInputProps}
          placeholderTextColor={colors.textLight}
          style={styles.input}
        />
      </View>

      {showError && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },

  inputContainer: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  inputError: {
    borderColor: colors.danger,
  },

  icon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    paddingVertical: 14,
  },

  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 5,
  },
});