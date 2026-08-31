import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import colors from "../constants/colors";
import { Food } from "../types/food";

interface FoodCardProps {
  food: Food;
  onPress?: () => void;
  onAddToCart?: () => void;
}

const FoodCard = ({
  food,
  onPress,
  onAddToCart,
}: FoodCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <Image
        source={{ uri: food.image }}
        style={styles.image}
      />

      {food.isPopular && (
        <View style={styles.popularBadge}>
          <Ionicons
            name="flame"
            size={12}
            color={colors.white}
          />

          <Text style={styles.popularText}>
            Popular
          </Text>
        </View>
      )}

      <View style={styles.content}>
        <Text
          style={styles.name}
          numberOfLines={1}
        >
          {food.name}
        </Text>

        <Text
          style={styles.description}
          numberOfLines={2}
        >
          {food.description}
        </Text>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>
            ${food.price.toFixed(2)}
          </Text>

          <Pressable
            onPress={(event) => {
              // Prevent the parent card's onPress
              // from opening the food details screen.
              event.stopPropagation();

              onAddToCart?.();
            }}
            style={styles.addButton}
            hitSlop={6}
          >
            <Ionicons
              name="add"
              size={21}
              color={colors.white}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

export default FoodCard;

const styles = StyleSheet.create({
  container: {
    width: 220,
    backgroundColor: colors.white,
    borderRadius: 18,
    overflow: "hidden",
    marginRight: 14,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.07,
    shadowRadius: 7,
    elevation: 3,
  },

  pressed: {
    opacity: 0.9,
  },

  image: {
    width: "100%",
    height: 145,
  },

  popularBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },

  popularText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 3,
  },

  content: {
    padding: 12,
  },

  name: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },

  description: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
    minHeight: 34,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },

  price: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "900",
  },

  addButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});