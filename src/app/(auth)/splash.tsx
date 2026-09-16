import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import colors from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import { storage } from "../../services/storage";

const SplashScreen = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    const initializeApp = async () => {
      try {
        // If a session exists, go directly to the main application.
        if (user) {
          router.replace("/(tabs)/home");
          return;
        }

        // Otherwise determine whether onboarding has already
        // been completed on this device.
        const onboardingCompleted = await storage.hasCompletedOnboarding();

        if (onboardingCompleted) {
          router.replace("/(auth)/login");
        } else {
          router.replace("/(auth)/onboarding");
        }
      } catch (error) {
        console.error("Failed to initialize application:", error);

        // Safe fallback if storage fails.
        router.replace("/(auth)/login");
      }
    };

    initializeApp();
  }, [loading, user]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Ionicons name="restaurant" size={48} color={colors.white} />
      </View>

      <Text style={styles.title}>Foodie</Text>

      <Text style={styles.subtitle}>Delicious food, delivered to you.</Text>

      <View style={styles.loadingContainer}>
        <View style={styles.loadingDot} />
        <Text style={styles.loadingText}>Getting things ready...</Text>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    color: colors.white,
    fontSize: 38,
    fontWeight: "800",
    letterSpacing: -1,
  },

  subtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
  },

  loadingContainer: {
    position: "absolute",
    bottom: 50,
    alignItems: "center",
  },

  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
    marginBottom: 8,
  },

  loadingText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
});
