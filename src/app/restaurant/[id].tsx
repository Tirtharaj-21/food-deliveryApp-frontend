import { useEffect, useMemo, useState } from "react";

import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import FoodCard from "../../components/FoodCard";
import colors from "../../constants/colors";
import { useCart } from "../../context/CartContext";

import {
  getFoodsByRestaurantId,
  getRestaurantById,
} from "../../services/restaurantApi";

import { Food } from "../../types/food";
import { Restaurant } from "../../types/restaurant";

const RestaurantDetailScreen = () => {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const { addToCart } = useCart();

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  const [restaurantFoods, setRestaurantFoods] = useState<Food[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const restaurantId = Number(id);

  useEffect(() => {
    const loadRestaurantDetails = async () => {
      if (Number.isNaN(restaurantId)) {
        setError("Invalid restaurant ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [restaurantData, foodData] = await Promise.all([
          getRestaurantById(restaurantId),
          getFoodsByRestaurantId(restaurantId),
        ]);

        setRestaurant(restaurantData);
        setRestaurantFoods(foodData);
      } catch (error) {
        console.error("Failed to load restaurant details:", error);

        setError("Failed to load restaurant details");
      } finally {
        setLoading(false);
      }
    };

    loadRestaurantDetails();
  }, [restaurantId]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(restaurantFoods.map((food) => food.category)),
    );

    return ["All", ...uniqueCategories];
  }, [restaurantFoods]);

  const filteredFoods =
    selectedCategory === "All"
      ? restaurantFoods
      : restaurantFoods.filter((food) => food.category === selectedCategory);

  if (loading) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundTitle}>Loading restaurant...</Text>
      </View>
    );
  }

  if (error || !restaurant) {
    return (
      <View style={styles.notFound}>
        <Ionicons
          name="restaurant-outline"
          size={50}
          color={colors.textLight}
        />

        <Text style={styles.notFoundTitle}>
          {error || "Restaurant not found"}
        </Text>

        <Pressable onPress={() => router.back()} style={styles.backHomeButton}>
          <Text style={styles.backHomeText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredFoods}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <FoodCard
            food={item}
            onPress={() =>
              router.push({
                pathname: "/food/[id]",
                params: {
                  id: String(item.id),
                },
              })
            }
            onAddToCart={() => addToCart(item)}
          />
        )}
        ListHeaderComponent={
          <>
            <View style={styles.heroContainer}>
              <Image
                source={{
                  uri: restaurant.image,
                }}
                style={styles.heroImage}
              />

              <Pressable
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={22} color={colors.text} />
              </Pressable>
            </View>

            <View style={styles.restaurantInfo}>
              <View style={styles.titleRow}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>

                <View style={styles.rating}>
                  <Ionicons name="star" size={14} color={colors.warning} />

                  <Text style={styles.ratingText}>
                    {restaurant.rating.toFixed(1)}
                  </Text>
                </View>
              </View>

              <Text style={styles.cuisine}>{restaurant.cuisine}</Text>

              <View style={styles.metaRow}>
                <View style={styles.meta}>
                  <Ionicons
                    name="time-outline"
                    size={17}
                    color={colors.primary}
                  />

                  <Text style={styles.metaText}>{restaurant.deliveryTime}</Text>
                </View>

                <View style={styles.meta}>
                  <Ionicons
                    name="bicycle-outline"
                    size={17}
                    color={colors.primary}
                  />

                  <Text style={styles.metaText}>
                    {restaurant.deliveryFee === 0
                      ? "Free delivery"
                      : `$${restaurant.deliveryFee.toFixed(2)} delivery`}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu</Text>
            </View>

            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.categoryList}
              renderItem={({ item }) => {
                const active = selectedCategory === item;

                return (
                  <Pressable
                    onPress={() => setSelectedCategory(item)}
                    style={[
                      styles.categoryButton,
                      active && styles.activeCategory,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        active && styles.activeCategoryText,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No menu items</Text>

            <Text style={styles.emptyText}>
              This restaurant doesn't have any items yet.
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default RestaurantDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  listContent: {
    paddingBottom: 30,
  },

  heroContainer: {
    height: 230,
    position: "relative",
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: 18,
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },

  restaurantInfo: {
    backgroundColor: colors.white,
    padding: 18,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  restaurantName: {
    flex: 1,
    fontSize: 25,
    fontWeight: "900",
    color: colors.text,
  },

  rating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E7",
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginLeft: 10,
  },

  ratingText: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 12,
    marginLeft: 4,
  },

  cuisine: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 5,
  },

  metaRow: {
    flexDirection: "row",
    marginTop: 15,
  },

  meta: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 22,
  },

  metaText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginLeft: 6,
  },

  menuHeader: {
    paddingHorizontal: 18,
    paddingTop: 22,
  },

  menuTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: colors.text,
  },

  categoryList: {
    paddingHorizontal: 18,
    paddingVertical: 14,
  },

  categoryButton: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
    marginRight: 8,
  },

  activeCategory: {
    backgroundColor: colors.primary,
  },

  categoryText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },

  activeCategoryText: {
    color: colors.white,
  },

  empty: {
    alignItems: "center",
    padding: 50,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },

  emptyText: {
    color: colors.textSecondary,
    marginTop: 5,
  },

  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 20,
  },

  notFoundTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
    textAlign: "center",
  },

  backHomeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },

  backHomeText: {
    color: colors.white,
    fontWeight: "700",
  },
});
