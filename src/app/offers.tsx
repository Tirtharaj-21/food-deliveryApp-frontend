import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import colors from "../constants/colors";

const OffersScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>

          <Text style={styles.headerTitle}>Offers</Text>

          <View style={styles.headerPlaceholder} />
        </View>

        {/* Main Offer */}
        <View style={styles.offerCard}>
          <Text style={styles.limitedTime}>LIMITED TIME</Text>

          <Text style={styles.discount}>30% OFF</Text>

          <Text style={styles.firstOrder}>On your first order</Text>

          <Text style={styles.description}>
            Enjoy 30% off your first food delivery order.
          </Text>

          {/* Coupon */}
          <View style={styles.couponContainer}>
            <Text style={styles.couponLabel}>USE CODE</Text>

            <Text style={styles.couponCode}>FIRST30</Text>
          </View>
        </View>

        {/* Offer Details */}
        <Text style={styles.sectionTitle}>Offer details</Text>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={colors.primary}
            />

            <Text style={styles.detailText}>
              30% discount on your first order
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={colors.primary}
            />

            <Text style={styles.detailText}>Valid for new customers</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={colors.primary}
            />

            <Text style={styles.detailText}>One offer per customer</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={colors.primary}
            />

            <Text style={styles.detailText}>Limited-time promotion</Text>
          </View>
        </View>

        {/* CTA */}
        <Pressable
          style={styles.orderButton}
          onPress={() => router.push("/(tabs)/home")}
        >
          <Text style={styles.orderButtonText}>Browse restaurants</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default OffersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },

  header: {
    height: 65,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: colors.text,
  },

  headerPlaceholder: {
    width: 42,
  },

  offerCard: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    padding: 24,
    marginTop: 10,
  },

  limitedTime: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  discount: {
    color: colors.white,
    fontSize: 40,
    fontWeight: "900",
    marginTop: 5,
  },

  firstOrder: {
    color: colors.white,
    fontSize: 19,
    marginTop: 2,
  },

  description: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 15,
  },

  couponContainer: {
    alignSelf: "flex-start",
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 20,
  },

  couponLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: "700",
  },

  couponCode: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: "900",
    marginTop: 2,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    marginTop: 28,
    marginBottom: 12,
  },

  detailsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  detailText: {
    color: colors.text,
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },

  orderButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 25,
  },

  orderButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "800",
  },
});
