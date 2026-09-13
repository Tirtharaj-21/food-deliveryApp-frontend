import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import RestaurantCard from "../../components/RestaurantCard";
import colors from "../../constants/colors";
import { useAuth } from "../../hooks/useAuth";

import { getAddresses } from "../../services/addressApi";
import { getRestaurants } from "../../services/restaurantApi";
import { Address } from "../../types/address";
import { Restaurant } from "../../types/restaurant";

const categories = [
  {
    id: "all",
    name: "All",
    icon: "restaurant-outline" as const,
  },
  {
    id: "pizza",
    name: "Pizza",
    icon: "pizza-outline" as const,
  },
  {
    id: "burger",
    name: "Burgers",
    icon: "fast-food-outline" as const,
  },
  {
    id: "healthy",
    name: "Healthy",
    icon: "leaf-outline" as const,
  },
  {
    id: "asian",
    name: "Asian",
    icon: "restaurant-outline" as const,
  },
];

const HomeScreen = () => {
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

  // Load restaurants when HomeScreen opens
  useEffect(() => {
    loadRestaurants();
  }, []);

  // Load the user's saved addresses for the delivery dropdown
  useEffect(() => {
    loadAddresses();
  }, [user]);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getRestaurants();

      setRestaurants(data);
    } catch (error) {
      console.error("Failed to load restaurants:", error);
      setError("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  const loadAddresses = async () => {
    if (!user) {
      return;
    }

    try {
      setLoadingAddresses(true);

      const data = await getAddresses(Number(user.id));

      setAddresses(data);

      // Select the first address by default
      setSelectedAddress((prev) => prev ?? data[0] ?? null);
    } catch (error) {
      console.error("Failed to load addresses:", error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const getDayGreeting = () => {
    const today = new Date();

    const day = today.toLocaleDateString("en-US", {
      weekday: "long",
    });

    return `Happy ${day} 👋`;
  };

  const filteredRestaurants = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return restaurants.filter((restaurant) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        restaurant.name.toLowerCase().includes(normalizedSearch) ||
        restaurant.cuisine.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "all" ||
        restaurant.categories.some((category) =>
          category.toLowerCase().includes(selectedCategory),
        );

      return matchesSearch && matchesCategory;
    });
  }, [restaurants, search, selectedCategory]);

  const locationLabel = selectedAddress
    ? `${selectedAddress.addressLine1}, ${selectedAddress.city}`
    : "Add a delivery address";

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <RestaurantCard
            restaurant={item}
            onPress={() =>
              router.push({
                pathname: "/restaurant/[id]",
                params: {
                  id: item.id,
                },
              })
            }
          />
        )}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>{getDayGreeting()}</Text>

                <Text style={styles.userName}>{user?.name || "Foodie"}</Text>
              </View>

              <Pressable
                style={styles.profileButton}
                onPress={() => router.push("/profile")}
              >
                <Ionicons name="person-outline" size={21} color={colors.text} />
              </Pressable>
            </View>

            <Pressable
              style={styles.locationContainer}
              onPress={() => setIsLocationModalVisible(true)}
            >
              <Ionicons name="location" size={17} color={colors.primary} />

              <View style={styles.locationTextContainer}>
                <Text style={styles.locationLabel}>Delivering to</Text>

                <Text style={styles.location} numberOfLines={1}>
                  {locationLabel}
                </Text>
              </View>

              <Ionicons
                name="chevron-down"
                size={16}
                color={colors.textSecondary}
                style={styles.locationArrow}
              />
            </Pressable>

            <View style={styles.searchContainer}>
              <Ionicons
                name="search-outline"
                size={21}
                color={colors.textSecondary}
              />

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search restaurants or food"
                placeholderTextColor={colors.textLight}
                style={styles.searchInput}
              />

              {search.length > 0 && (
                <Pressable onPress={() => setSearch("")}>
                  <Ionicons
                    name="close-circle"
                    size={19}
                    color={colors.textLight}
                  />
                </Pressable>
              )}
            </View>

            <View style={styles.banner}>
              <View style={styles.bannerContent}>
                <Text style={styles.bannerSmall}>LIMITED TIME</Text>

                <Text style={styles.bannerTitle}>30% OFF</Text>

                <Text style={styles.bannerDescription}>
                  On your first order
                </Text>

                <Pressable
                  style={styles.bannerButton}
                  onPress={() => router.push("/offers")}
                >
                  <Text style={styles.bannerButtonText}>Order now</Text>
                </Pressable>
              </View>

              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1547592180-85f173990554?w=500",
                }}
                style={styles.bannerImage}
              />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categories</Text>
            </View>

            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.categoriesContainer}
              renderItem={({ item }) => {
                const active = selectedCategory === item.id;

                return (
                  <Pressable
                    onPress={() => setSelectedCategory(item.id)}
                    style={[styles.category, active && styles.activeCategory]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={21}
                      color={active ? colors.white : colors.primary}
                    />

                    <Text
                      style={[
                        styles.categoryText,
                        active && styles.activeCategoryText,
                      ]}
                    >
                      {item.name}
                    </Text>
                  </Pressable>
                );
              }}
            />

            <Modal
              visible={isLocationModalVisible}
              transparent
              animationType="slide"
              onRequestClose={() => setIsLocationModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                {/* Dark background */}
                <Pressable
                  style={styles.modalBackdrop}
                  onPress={() => setIsLocationModalVisible(false)}
                />

                {/* Bottom sheet */}
                <View style={styles.modalSheet}>
                  <Text style={styles.modalTitle}>Delivery address</Text>

                  {loadingAddresses && (
                    <Text style={styles.modalEmptyText}>
                      Loading addresses...
                    </Text>
                  )}

                  {!loadingAddresses && addresses.length === 0 && (
                    <Text style={styles.modalEmptyText}>
                      You don't have any saved addresses yet.
                    </Text>
                  )}

                  <FlatList
                    data={addresses}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => {
                      const active = selectedAddress?.id === item.id;

                      return (
                        <Pressable
                          style={[
                            styles.addressOption,
                            active && styles.activeAddressOption,
                          ]}
                          onPress={() => {
                            setSelectedAddress(item);
                            setIsLocationModalVisible(false);
                          }}
                        >
                          <Ionicons
                            name={
                              active ? "radio-button-on" : "radio-button-off"
                            }
                            size={20}
                            color={active ? colors.primary : colors.textLight}
                          />

                          <View style={styles.addressOptionText}>
                            <Text style={styles.addressOptionLine}>
                              {item.addressLine1}
                              {item.addressLine2
                                ? `, ${item.addressLine2}`
                                : ""}
                            </Text>

                            <Text style={styles.addressOptionSubLine}>
                              {item.city}, {item.state} {item.postalCode}
                            </Text>
                          </View>
                        </Pressable>
                      );
                    }}
                  />

                  <Pressable
                    style={styles.addAddressButton}
                    onPress={() => {
                      setIsLocationModalVisible(false);
                      router.push("/profile");
                    }}
                  >
                    <Ionicons name="add" size={18} color={colors.primary} />

                    <Text style={styles.addAddressText}>Add new address</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nearby restaurants</Text>

              <Text style={styles.restaurantCount}>
                {filteredRestaurants.length} places
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="search-outline"
              size={48}
              color={colors.textLight}
            />

            <Text style={styles.emptyTitle}>No restaurants found</Text>

            <Text style={styles.emptyText}>
              Try another search or category.
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  listContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  greeting: {
    color: colors.textSecondary,
    fontSize: 18,
    marginTop: 8,
    marginBottom: 4,
  },

  userName: {
    color: colors.text,
    fontSize: 25,
    fontWeight: "800",
    marginTop: 2,
  },

  locationTextContainer: {
    flex: 1,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },

  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  modalSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "70%",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 14,
  },

  modalEmptyText: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 14,
  },

  addressOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },

  activeAddressOption: {
    backgroundColor: "#FFF6F2",
  },

  addressOptionText: {
    marginLeft: 12,
    flex: 1,
  },

  addressOptionLine: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },

  addressOptionSubLine: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },

  addAddressButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  addAddressText: {
    color: colors.primary,
    fontWeight: "700",
    marginLeft: 6,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },

  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  locationLabel: {
    color: colors.textLight,
    fontSize: 11,
    marginLeft: 7,
  },

  location: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 7,
    marginTop: 2,
  },

  locationArrow: {
    marginLeft: 5,
  },

  searchContainer: {
    height: 52,
    backgroundColor: colors.white,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 18,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: colors.text,
    fontSize: 14,
  },

  banner: {
    height: 155,
    borderRadius: 20,
    backgroundColor: colors.primary,
    marginTop: 20,
    overflow: "hidden",
    flexDirection: "row",
  },

  bannerContent: {
    flex: 1,
    padding: 18,
    zIndex: 2,
  },

  bannerSmall: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 10,
    fontWeight: "700",
  },

  bannerTitle: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "900",
    marginTop: 2,
  },

  bannerDescription: {
    color: colors.white,
    fontSize: 12,
    marginTop: -2,
  },

  bannerButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.white,
    borderRadius: 9,
    paddingHorizontal: 11,
    paddingVertical: 7,
    marginTop: 12,
  },

  bannerButtonText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "800",
  },

  bannerImage: {
    width: 155,
    height: "100%",
    opacity: 0.8,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: colors.text,
  },

  restaurantCount: {
    color: colors.textSecondary,
    fontSize: 12,
  },

  categoriesContainer: {
    paddingBottom: 2,
  },

  category: {
    height: 76,
    minWidth: 72,
    backgroundColor: colors.white,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    paddingHorizontal: 10,
  },

  activeCategory: {
    backgroundColor: colors.primary,
  },

  categoryText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 6,
  },

  activeCategoryText: {
    color: colors.white,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 70,
  },

  emptyTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
    marginTop: 12,
  },

  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 5,
  },
});
