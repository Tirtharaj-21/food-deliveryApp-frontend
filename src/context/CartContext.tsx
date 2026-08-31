import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { CartItem, Food } from "../types/food";

interface CartContextType {
  cartItems: CartItem[];

  // Cart actions
  addToCart: (food: Food) => void;
  removeFromCart: (foodId: string) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  incrementQuantity: (foodId: string) => void;
  decrementQuantity: (foodId: string) => void;
  clearCart: () => void;

  // Derived cart information
  totalItems: number;
  totalPrice: number;
}

interface CartProviderProps {
  children: ReactNode;
}

// Context starts as undefined so we can detect
// if useCart() is used outside CartProvider.
const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export const CartProvider = ({
  children,
}: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  /**
   * Add food to cart.
   *
   * If the food already exists, increase its quantity.
   * Otherwise create a new CartItem with quantity = 1.
   */
  const addToCart = useCallback((food: Food) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === food.id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === food.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...food,
          quantity: 1,
        },
      ];
    });
  }, []);

  /**
   * Completely remove an item from the cart.
   */
  const removeFromCart = useCallback((foodId: string) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== foodId)
    );
  }, []);

  /**
   * Set an exact quantity.
   *
   * Quantity <= 0 means the item should be removed.
   */
  const updateQuantity = useCallback(
    (foodId: string, quantity: number) => {
      if (quantity <= 0) {
        setCartItems((currentItems) =>
          currentItems.filter((item) => item.id !== foodId)
        );

        return;
      }

      setCartItems((currentItems) =>
        currentItems.map((item) =>
          item.id === foodId
            ? {
                ...item,
                quantity,
              }
            : item
        )
      );
    },
    []
  );

  /**
   * Increase quantity by one.
   */
  const incrementQuantity = useCallback((foodId: string) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === foodId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }, []);

  /**
   * Decrease quantity by one.
   *
   * If quantity becomes zero, remove the item.
   */
  const decrementQuantity = useCallback((foodId: string) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === foodId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  /**
   * Empty the entire cart.
   */
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  /**
   * Total number of individual food items.
   *
   * Example:
   * Burger x2
   * Pizza x1
   *
   * totalItems = 3
   */
  const totalItems = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [cartItems]);

  /**
   * Total cart price.
   *
   * Example:
   * Burger $10 x 2 = $20
   * Pizza  $15 x 1 = $15
   *
   * totalPrice = $35
   */
  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  /**
   * Context value.
   *
   * useMemo prevents creating a new object on every render
   * unless one of its dependencies actually changes.
   */
  const value = useMemo<CartContextType>(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      incrementQuantity,
      decrementQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }),
    [
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      incrementQuantity,
      decrementQuantity,
      clearCart,
      totalItems,
      totalPrice,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

/**
 * Custom hook used by screens/components to access cart state.
 *
 * Example:
 * const { cartItems, addToCart, totalPrice } = useCart();
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error(
      "useCart must be used inside a CartProvider"
    );
  }

  return context;
};