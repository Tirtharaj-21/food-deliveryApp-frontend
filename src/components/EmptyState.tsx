import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import colors from "../constants/colors";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  buttonText?: string;
  onButtonPress?: () => void;
}

const EmptyState = ({
  icon = "file-tray-outline",
  title,
  description,
  buttonText,
  onButtonPress,
}: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={icon}
          size={42}
          color={colors.primary}
        />
      </View>

      <Text style={styles.title}>{title}</Text>

      {description && (
        <Text style={styles.description}>
          {description}
        </Text>
      )}

      {buttonText && onButtonPress && (
        <Pressable
          onPress={onButtonPress}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {buttonText}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 60,
  },

  iconContainer: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#FFF1EB",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 18,
  },

  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 7,
  },

  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },

  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
});