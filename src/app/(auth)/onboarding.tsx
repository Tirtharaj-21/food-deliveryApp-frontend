import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { storage } from "../../services/storage";

import CustomButton from "../../components/CustomButton";
import colors from "../../constants/colors";


const { width } = Dimensions.get("window");

interface OnboardingItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

const onboardingData: OnboardingItem[] = [
  {
    id: "1",
    icon: "restaurant",
    title: "Discover great food",
    description:
      "Explore restaurants around you and discover meals you'll love.",
  },
  {
    id: "2",
    icon: "fast-food",
    title: "Order with ease",
    description:
      "Browse menus, customize your order and add your favorites to your cart.",
  },
  {
    id: "3",
    icon: "bicycle",
    title: "Delivered to your door",
    description:
      "Track your orders and enjoy delicious food without leaving home.",
  },
];

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const listRef =
    useRef<FlatList<OnboardingItem>>(null);

  const isLastSlide =
    currentIndex === onboardingData.length - 1;

  const handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;

    const index = Math.round(offsetX / width);

    setCurrentIndex(index);
  };

  const completeOnboarding = async () => {
    await storage.setOnboardingCompleted();

    router.replace("/(auth)/login");
  };

  const handleNext = () => {
    if (isLastSlide) {
      completeOnboarding();
      return;
    }

    listRef.current?.scrollToIndex({
      index: currentIndex + 1,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={onboardingData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={handleScroll}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={item.icon}
                size={72}
                color={colors.primary}
              />
            </View>

            <Text style={styles.title}>
              {item.title}
            </Text>

            <Text style={styles.description}>
              {item.description}
            </Text>
          </View>
        )}
      />

      <View style={styles.bottomContainer}>
        <View style={styles.pagination}>
          {onboardingData.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.dot,
                index === currentIndex &&
                  styles.activeDot,
              ]}
            />
          ))}
        </View>

        <CustomButton
          title={isLastSlide ? "Get Started" : "Continue"}
          onPress={handleNext}
        />

        {!isLastSlide && (
          <Text
            onPress={completeOnboarding}
            style={styles.skip}
          >
            Skip
          </Text>
        )}
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  slide: {
    width,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 35,
    paddingBottom: 100,
  },

  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#FFF1EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
  },

  description: {
    fontSize: 16,
    lineHeight: 25,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 14,
  },

  bottomContainer: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 35,
  },

  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },

  activeDot: {
    width: 24,
    backgroundColor: colors.primary,
  },

  skip: {
    textAlign: "center",
    marginTop: 16,
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
});