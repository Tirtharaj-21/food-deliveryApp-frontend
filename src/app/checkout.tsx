import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import colors from "../constants/colors";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";

const DELIVERY_FEE = 2.99;
const TAX_RATE = 0.08;

const CheckoutScreen = () => {
  const {
    cartItems,
    totalPrice,
    clearCart,
  } = useCart();

  const { createOrder } = useOrders();

  const [isPlacingOrder, setIsPlacingOrder] =
    useState(false);

  const [address, setAddress] = useState(
    "123 Main Street, New York, NY"
  );

  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");

  const tax = useMemo(() => {
    return totalPrice * TAX_RATE;
  }, [totalPrice]);

  const deliveryFee =
    cartItems.length > 0
      ? DELIVERY_FEE
      : 0;

  const total = useMemo(() => {
    return (
      totalPrice +
      deliveryFee +
      tax
    );
  }, [
    totalPrice,
    deliveryFee,
    tax,
  ]);

  /**
   * Places the order locally.
   *
   * OrderContext creates the order and CartContext
   * clears the customer's current cart.
   */
  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      Alert.alert(
        "Empty Cart",
        "Please add items before checking out."
      );

      return;
    }

    if (!address.trim()) {
      Alert.alert(
        "Address Required",
        "Please provide a delivery address."
      );

      return;
    }

    setIsPlacingOrder(true);

    // Simulate a short API/network delay.
    setTimeout(() => {
      const order = createOrder({
        items: cartItems,
        subtotal: totalPrice,
        deliveryFee,
        tax,
        total,
        deliveryAddress: address,
        paymentMethod,
      });

      clearCart();

      setIsPlacingOrder(false);

      Alert.alert(
        "Order Placed!",
        `Your order ${order.id} has been placed successfully.`,
        [
          {
            text: "View Orders",
            onPress: () =>
              router.replace(
                "/(tabs)/orders"
              ),
          },
        ]
      );
    }, 700);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color={colors.text}
            />
          </Pressable>

          <Text style={styles.headerTitle}>
            Checkout
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Delivery Address */}
        <Text style={styles.sectionTitle}>
          Delivery Address
        </Text>

        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <Ionicons
              name="location-outline"
              size={22}
              color={colors.primary}
            />
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              Home
            </Text>

            <Text style={styles.cardText}>
              {address}
            </Text>
          </View>

          <Pressable
            onPress={() =>
              Alert.alert(
                "Address",
                "Address editing can be connected to a form in a real application."
              )
            }
          >
            <Text style={styles.changeText}>
              Change
            </Text>
          </Pressable>
        </View>

        {/* Payment */}
        <Text style={styles.sectionTitle}>
          Payment Method
        </Text>

        <Pressable
          onPress={() =>
            setPaymentMethod(
              paymentMethod ===
                "Cash on Delivery"
                ? "Credit Card"
                : "Cash on Delivery"
            )
          }
          style={styles.card}
        >
          <View style={styles.cardIcon}>
            <Ionicons
              name={
                paymentMethod ===
                "Cash on Delivery"
                  ? "cash-outline"
                  : "card-outline"
              }
              size={22}
              color={colors.primary}
            />
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>
              {paymentMethod}
            </Text>

            <Text style={styles.cardText}>
              Tap to change payment method
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={19}
            color={colors.textLight}
          />
        </Pressable>

        {/* Items */}
        <Text style={styles.sectionTitle}>
          Order Items
        </Text>

        <View style={styles.itemsCard}>
          {cartItems.map((item) => (
            <View
              key={item.id}
              style={styles.itemRow}
            >
              <View style={styles.quantityBadge}>
                <Text
                  style={styles.quantityText}
                >
                  {item.quantity}x
                </Text>
              </View>

              <Text
                style={styles.itemName}
                numberOfLines={1}
              >
                {item.name}
              </Text>

              <Text style={styles.itemPrice}>
                $
                {(
                  item.price *
                  item.quantity
                ).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <Text style={styles.sectionTitle}>
          Order Summary
        </Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>
              Subtotal
            </Text>

            <Text style={styles.value}>
              ${totalPrice.toFixed(2)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.label}>
              Delivery
            </Text>

            <Text style={styles.value}>
              ${deliveryFee.toFixed(2)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.label}>
              Tax
            </Text>

            <Text style={styles.value}>
              ${tax.toFixed(2)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Total
            </Text>

            <Text style={styles.totalValue}>
              ${total.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomContainer}>
        <View>
          <Text style={styles.bottomLabel}>
            Total
          </Text>

          <Text style={styles.bottomTotal}>
            ${total.toFixed(2)}
          </Text>
        </View>

        <Pressable
          disabled={isPlacingOrder}
          onPress={handlePlaceOrder}
          style={[
            styles.placeButton,
            isPlacingOrder &&
              styles.disabledButton,
          ]}
        >
          {isPlacingOrder ? (
            <Text style={styles.placeButtonText}>
              Placing...
            </Text>
          ) : (
            <>
              <Text style={styles.placeButtonText}>
                Place Order
              </Text>

              <Ionicons
                name="arrow-forward"
                size={19}
                color={colors.white}
              />
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 120,
  },

  header: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: "900",
  },

  headerSpacer: {
    width: 40,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
    marginTop: 18,
    marginBottom: 10,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  cardIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FFF1EB",
    alignItems: "center",
    justifyContent: "center",
  },

  cardContent: {
    flex: 1,
    marginLeft: 12,
  },

  cardTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
  },

  cardText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },

  changeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },

  itemsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 7,
  },

  quantityBadge: {
    backgroundColor: "#FFF1EB",
    borderRadius: 7,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },

  quantityText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "800",
  },

  itemName: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 10,
  },

  itemPrice: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },

  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  label: {
    color: colors.textSecondary,
    fontSize: 13,
  },

  value: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  totalLabel: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
  },

  totalValue: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "900",
  },

  bottomContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: colors.white,

    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 24,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 7,
    elevation: 10,
  },

  bottomLabel: {
    color: colors.textSecondary,
    fontSize: 11,
  },

  bottomTotal: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    marginTop: 2,
  },

  placeButton: {
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  disabledButton: {
    opacity: 0.6,
  },

  placeButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "800",
    marginRight: 7,
  },
});