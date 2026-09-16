import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import colors from "../constants/colors";
import { Restaurant } from "../types/restaurant";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
}

const RestaurantCard = ({ restaurant, onPress }: RestaurantCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Image
        source={{ uri: restaurant.imageUrl }}
        style={styles.image}
        resizeMode="cover"
        onLoad={() => {
          console.log("IMAGE LOADED:", restaurant.name);
        }}
        onError={(event) => {
          console.log("IMAGE ERROR:", restaurant.name, event.nativeEvent.error);
        }}
      />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {restaurant.name}
          </Text>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color={colors.warning} />

            <Text style={styles.rating}>{restaurant.rating.toFixed(1)}</Text>
          </View>
        </View>

        <Text style={styles.cuisine} numberOfLines={1}>
          {restaurant.cuisine}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons
              name="time-outline"
              size={15}
              color={colors.textSecondary}
            />

            <Text style={styles.metaText}>{restaurant.deliveryTime}</Text>
          </View>

          <View style={styles.metaItem}>
            <Ionicons
              name="bicycle-outline"
              size={15}
              color={colors.textSecondary}
            />

            <Text style={styles.metaText}>
              {restaurant.deliveryFee == null || restaurant.deliveryFee === 0
                ? "Free delivery"
                : `$${restaurant.deliveryFee.toFixed(2)}`}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default RestaurantCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    marginBottom: 16,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  pressed: {
    opacity: 0.9,
  },

  image: {
    width: "100%",
    height: 175,
  },

  content: {
    padding: 14,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  name: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginRight: 10,
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E7",
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },

  rating: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
    marginLeft: 4,
  },

  cuisine: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 5,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 18,
  },

  metaText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginLeft: 5,
  },
});
