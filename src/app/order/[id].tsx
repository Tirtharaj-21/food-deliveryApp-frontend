import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  useLocalSearchParams
} from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import colors from "../../constants/colors";
import { useOrders } from "../../context/OrderContext";

const OrderDetailsScreen = () => {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const { getOrderById } = useOrders();

  const order = getOrderById(id);

  if (!order) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>
          Order not found
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        <View style={styles.header}>
          <Ionicons
            name="checkmark-circle"
            size={45}
            color={colors.primary}
          />

          <Text style={styles.title}>
            Order Confirmed
          </Text>

          <Text style={styles.orderId}>
            {order.id}
          </Text>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {order.status}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Items
        </Text>

        <View style={styles.card}>
          {order.items.map((item) => (
            <View
              key={item.id}
              style={styles.itemRow}
            >
              <View
                style={styles.quantityBadge}
              >
                <Text
                  style={
                    styles.quantityText
                  }
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

              <Text
                style={styles.itemPrice}
              >
                $
                {(
                  item.price *
                  item.quantity
                ).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>
          Delivery
        </Text>

        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Ionicons
              name="location-outline"
              size={20}
              color={colors.primary}
            />

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>
                Delivery Address
              </Text>

              <Text style={styles.infoValue}>
                {order.deliveryAddress}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="card-outline"
              size={20}
              color={colors.primary}
            />

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>
                Payment
              </Text>

              <Text style={styles.infoValue}>
                {order.paymentMethod}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Payment Summary
        </Text>

        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>
              Subtotal
            </Text>

            <Text style={styles.value}>
              ${order.subtotal.toFixed(2)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.label}>
              Delivery fee
            </Text>

            <Text style={styles.value}>
              ${order.deliveryFee.toFixed(
                2
              )}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.label}>
              Tax
            </Text>

            <Text style={styles.value}>
              ${order.tax.toFixed(2)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>
              Total
            </Text>

            <Text style={styles.total}>
              ${order.total.toFixed(2)}
            </Text>
          </View>
        </View>

        <Text style={styles.date}>
          Ordered{" "}
          {new Date(
            order.createdAt
          ).toLocaleString()}
        </Text>
      </ScrollView>
    </View>
  );
};

export default OrderDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    alignItems: "center",
    paddingTop: 25,
  },

  title: {
    color: colors.text,
    fontSize: 23,
    fontWeight: "900",
    marginTop: 10,
  },

  orderId: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 5,
  },

  statusBadge: {
    backgroundColor: "#FFF1EB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9,
    marginTop: 12,
  },

  statusText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "800",
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
    marginTop: 25,
    marginBottom: 10,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },

  quantityBadge: {
    backgroundColor: "#FFF1EB",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
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
    marginLeft: 10,
  },

  itemPrice: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },

  infoRow: {
    flexDirection: "row",
    marginVertical: 7,
  },

  infoContent: {
    marginLeft: 10,
    flex: 1,
  },

  infoLabel: {
    color: colors.textSecondary,
    fontSize: 11,
  },

  infoValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 3,
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

  totalLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },

  total: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "900",
  },

  date: {
    color: colors.textLight,
    fontSize: 11,
    textAlign: "center",
    marginTop: 20,
  },

  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  notFound: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
});