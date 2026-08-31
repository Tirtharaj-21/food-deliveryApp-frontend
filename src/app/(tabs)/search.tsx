import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import colors from "../../constants/colors";

const SearchScreen = () => {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search-outline"
        size={50}
        color={colors.textLight}
      />

      <Text style={styles.title}>
        Search
      </Text>

      <Text style={styles.subtitle}>
        Advanced search is coming next.
      </Text>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    marginTop: 12,
  },

  subtitle: {
    color: colors.textSecondary,
    marginTop: 5,
  },
});