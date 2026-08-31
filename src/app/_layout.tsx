import { router, Stack, useSegments } from "expo-router";
import React, { useEffect } from "react";

import { AppProvider } from "../context/AppProvider";
import { useAuth } from "../context/AuthContext";

function NavigationGuard() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
      return;
    }

    if (user && inAuthGroup) {
      router.replace("/(tabs)/home");
    }
  }, [user, isLoading, segments]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />

      <Stack.Screen name="restaurant/[id]" />
      <Stack.Screen name="food/[id]" />
      <Stack.Screen name="checkout" />
      <Stack.Screen name="order/[id]" />
      <Stack.Screen name="profile/edit" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <NavigationGuard />
    </AppProvider>
  );
}