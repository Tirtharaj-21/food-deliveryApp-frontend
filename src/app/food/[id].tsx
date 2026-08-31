import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import colors from "../../constants/colors";
import { useCart } from "../../context/CartContext";
import { foods } from "../../data/foods";

const FoodDetailsScreen = () => {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const { addToCart } = useCart();

  const food = foods.find((item) => item.id === id);

  if (!food) {
    return (
      <View style={styles.center}>
        <Ionicons
          name="alert-circle-outline"
          size={50}
          color={colors.primary}
        />

        <Text style={styles.notFound}>
          Food item not found
        </Text>

        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  const handleAddToCart = () => {
    addToCart(food);

    // Return to the previous screen after adding.
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View>
          <Image
            source={{ uri: food.image }}
            style={styles.image}
          />

          <Pressable
            onPress={() => router.back()}
            style={styles.backIcon}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.text}
            />
          </Pressable>
        </View>

        <View style={styles.content}>
          <View style={styles.categoryRow}>
            <Text style={styles.category}>
              {food.category}
            </Text>

            {food.isPopular && (
              <View style={styles.popularBadge}>
                <Ionicons
                  name="flame"
                  size={13}
                  color={colors.primary}
                />

                <Text style={styles.popularText}>
                  Popular
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.name}>
            {food.name}
          </Text>

          <Text style={styles.price}>
            ${food.price.toFixed(2)}
          </Text>

          <Text style={styles.sectionTitle}>
            Description
          </Text>

          <Text style={styles.description}>
            {food.description}
          </Text>

          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Ionicons
                name="restaurant-outline"
                size={20}
                color={colors.primary}
              />

              <Text style={styles.infoText}>
                Freshly prepared
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons
                name="time-outline"
                size={20}
                color={colors.primary}
              />

              <Text style={styles.infoText}>
                20–30 min
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <Pressable
          onPress={handleAddToCart}
          style={styles.addButton}
        >
          <Ionicons
            name="cart-outline"
            size={21}
            color={colors.white}
          />

          <Text style={styles.addButtonText}>
            Add to Cart
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default FoodDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingBottom: 110,
  },

  image: {
    width: "100%",
    height: 310,
  },

  backIcon: {
    position: "absolute",
    top: 55,
    left: 18,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    padding: 20,
  },

  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  category: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },

  popularBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF1EB",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    marginLeft: 10,
  },

  popularText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 3,
  },

  name: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
    marginTop: 9,
  },

  price: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 8,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 25,
  },

  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
  },

  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },

  infoText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 10,
  },

  bottomContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 25,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 10,
  },

  addButton: {
    height: 54,
    borderRadius: 15,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  addButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "800",
    marginLeft: 8,
  },

  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  notFound: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 12,
  },

  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },

  backButtonText: {
    color: colors.white,
    fontWeight: "700",
  },
});