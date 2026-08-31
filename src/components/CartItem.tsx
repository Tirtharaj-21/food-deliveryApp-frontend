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
import { CartItem as CartItemType } from "../types/food";

interface CartItemProps {
  item: CartItemType;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

const CartItem = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemProps) => {
  const itemTotal = item.price * item.quantity;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
      />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.nameContainer}>
            <Text
              style={styles.name}
              numberOfLines={2}
            >
              {item.name}
            </Text>

            <Text style={styles.category}>
              {item.category}
            </Text>
          </View>

          <Pressable
            onPress={onRemove}
            hitSlop={8}
            style={styles.removeButton}
          >
            <Ionicons
              name="trash-outline"
              size={19}
              color={colors.danger}
            />
          </Pressable>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>
            ${itemTotal.toFixed(2)}
          </Text>

          <View style={styles.quantityContainer}>
            <Pressable
              onPress={onDecrement}
              style={styles.quantityButton}
            >
              <Ionicons
                name="remove"
                size={16}
                color={colors.text}
              />
            </Pressable>

            <Text style={styles.quantity}>
              {item.quantity}
            </Text>

            <Pressable
              onPress={onIncrement}
              style={styles.quantityButton}
            >
              <Ionicons
                name="add"
                size={16}
                color={colors.text}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 13,
  },

  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  nameContainer: {
    flex: 1,
    paddingRight: 10,
  },

  name: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
  },

  category: {
    color: colors.textLight,
    fontSize: 11,
    marginTop: 3,
  },

  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#FFF1F1",
    alignItems: "center",
    justifyContent: "center",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },

  price: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "900",
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    overflow: "hidden",
  },

  quantityButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },

  quantity: {
    minWidth: 32,
    textAlign: "center",
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
  },
});