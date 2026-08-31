import React, { useMemo } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import CartItem from "../../components/CartItem";
import EmptyState from "../../components/EmptyState";
import colors from "../../constants/colors";
import { useCart } from "../../context/CartContext";

const DELIVERY_FEE = 2.99;
const TAX_RATE = 0.08;

const CartScreen = () => {
  const {
    cartItems,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    totalPrice,
    totalItems,
  } = useCart();

  /**
   * Calculate tax from the subtotal.
   *
   * This is derived data, so we don't store it
   * separately in state.
   */
  const tax = useMemo(() => {
    return totalPrice * TAX_RATE;
  }, [totalPrice]);

  /**
   * Delivery is free when the cart is empty.
   * For a real application this would normally
   * come from the restaurant/order configuration.
   */
  const deliveryFee =
    cartItems.length > 0 ? DELIVERY_FEE : 0;

  /**
   * Final amount the customer pays.
   */
  const grandTotal = useMemo(() => {
    return totalPrice + deliveryFee + tax;
  }, [totalPrice, deliveryFee, tax]);

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Your Cart
          </Text>
        </View>

        <EmptyState
          icon="cart-outline"
          title="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet."
          buttonText="Browse Restaurants"
          onButtonPress={() =>
            router.push("/(tabs)/home")
          }
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onIncrement={() =>
              incrementQuantity(item.id)
            }
            onDecrement={() =>
              decrementQuantity(item.id)
            }
            onRemove={() =>
              removeFromCart(item.id)
            }
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>
                Your Cart
              </Text>

              <Text style={styles.itemCount}>
                {totalItems}{" "}
                {totalItems === 1 ? "item" : "items"}
              </Text>
            </View>

            <Pressable
              onPress={() => {
                // We intentionally use the existing
                // remove functions rather than exposing
                // internal state to the screen.
                cartItems.forEach((item) =>
                  removeFromCart(item.id)
                );
              }}
            >
              <Text style={styles.clearText}>
                Clear all
              </Text>
            </Pressable>
          </View>
        }
        ListFooterComponent={
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>
              Order Summary
            </Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Subtotal
              </Text>

              <Text style={styles.summaryValue}>
                ${totalPrice.toFixed(2)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Delivery fee
              </Text>

              <Text style={styles.summaryValue}>
                ${deliveryFee.toFixed(2)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Tax
              </Text>

              <Text style={styles.summaryValue}>
                ${tax.toFixed(2)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Total
              </Text>

              <Text style={styles.totalValue}>
                ${grandTotal.toFixed(2)}
              </Text>
            </View>

            <Pressable
              onPress={() =>
                router.push("/checkout")
              }
              style={styles.checkoutButton}
            >
              <Text style={styles.checkoutText}>
                Proceed to Checkout
              </Text>

              <Ionicons
                name="arrow-forward"
                size={19}
                color={colors.white}
              />
            </Pressable>
          </View>
        }
      />
    </View>
  );
};

export default CartScreen;

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
    marginBottom: 20,
  },

  headerTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "900",
  },

  itemCount: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 3,
  },

  clearText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "700",
  },

  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 18,
    marginTop: 8,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 7,
    elevation: 2,
  },

  summaryTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  summaryLabel: {
    color: colors.textSecondary,
    fontSize: 13,
  },

  summaryValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 5,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  totalLabel: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
  },

  totalValue: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "900",
  },

  checkoutButton: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 14,
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  checkoutText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
    marginRight: 8,
  },
});