import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import colors from "../../constants/colors";
import { useAuth } from "../../hooks/useAuth";

const ProfileScreen = () => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Ionicons
          name="person"
          size={40}
          color={colors.primary}
        />
      </View>

      <Text style={styles.name}>
        {user?.name}
      </Text>

      <Text style={styles.email}>
        {user?.email}
      </Text>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    paddingTop: 80,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FFF1EB",
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
    marginTop: 18,
  },

  email: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 5,
  },
});