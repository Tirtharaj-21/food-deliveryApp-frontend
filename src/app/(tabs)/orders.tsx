import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import EmptyState from "../../components/EmptyState";
import colors from "../../constants/colors";
import { useOrders } from "../../context/OrderContext";
import { Order } from "../../types/order";

const OrdersScreen = () => {
  const { orders } = useOrders();

  const renderOrder = ({ item }: { item: Order }) => {
    const firstItem = item.items[0];

    const itemCount = item.items.reduce(
      (total, currentItem) => total + currentItem.quantity,
      0,
    );

    return (
      <Pressable
        onPress={() => router.push(`/order/${item.id}`)}
        style={styles.orderCard}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="receipt-outline" size={22} color={colors.primary} />
        </View>

        <View style={styles.orderContent}>
          <View style={styles.topRow}>
            <Text style={styles.orderId}>{item.id}</Text>

            <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
              <Text
                style={[styles.statusText, getStatusTextStyle(item.status)]}
              >
                {item.status}
              </Text>
            </View>
          </View>

          <Text style={styles.itemName} numberOfLines={1}>
            {firstItem?.name}
            {item.items.length > 1 ? ` + ${item.items.length - 1} more` : ""}
          </Text>

          <View style={styles.bottomRow}>
            <Text style={styles.itemCount}>
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </Text>

            <Text style={styles.total}>${item.total.toFixed(2)}</Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>

        <Text style={styles.subtitle}>
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </Text>
      </View>

      {orders.length === 0 ? (
        <EmptyState
          icon="receipt-outline"
          title="No orders yet"
          description="Your completed orders will appear here."
          buttonText="Start Ordering"
          onButtonPress={() => router.push("/(tabs)/home")}
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderOrder}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default OrdersScreen;

const getStatusStyle = (status: Order["status"]) => {
  switch (status) {
    case "Delivered":
      return styles.deliveredBadge;

    case "Cancelled":
      return styles.cancelledBadge;

    case "On the way":
      return styles.onWayBadge;

    default:
      return styles.preparingBadge;
  }
};

const getStatusTextStyle = (status: Order["status"]) => {
  switch (status) {
    case "Delivered":
      return styles.deliveredText;

    case "Cancelled":
      return styles.cancelledText;

    case "On the way":
      return styles.onWayText;

    default:
      return styles.preparingText;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 15,
  },

  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "900",
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },

  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 30,
  },

  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#FFF1EB",
    alignItems: "center",
    justifyContent: "center",
  },

  orderContent: {
    flex: 1,
    marginHorizontal: 12,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  orderId: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
  },

  statusText: {
    fontSize: 9,
    fontWeight: "800",
  },

  preparingBadge: {
    backgroundColor: "#FFF4D6",
  },

  preparingText: {
    color: "#9A6B00",
  },

  onWayBadge: {
    backgroundColor: "#EAF3FF",
  },

  onWayText: {
    color: "#2D6CDF",
  },

  deliveredBadge: {
    backgroundColor: "#E8F8EF",
  },

  deliveredText: {
    color: "#168A4A",
  },

  cancelledBadge: {
    backgroundColor: "#FFECEC",
  },

  cancelledText: {
    color: "#C43D3D",
  },

  itemName: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 7,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 7,
  },

  itemCount: {
    color: colors.textLight,
    fontSize: 11,
  },

  total: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "900",
  },
});
