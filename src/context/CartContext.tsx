import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  addToCart as addToCartApi,
  clearCart as clearCartApi,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../services/cartApi";

import { CartItem, Food } from "../types/food";

interface CartContextType {
  cartItems: CartItem[];

  // Cart actions
  fetchCart: () => Promise<void>;
  addToCart: (food: Food) => Promise<void>;
  removeFromCart: (foodId: number) => Promise<void>;
  updateQuantity: (foodId: number, quantity: number) => Promise<void>;
  incrementQuantity: (foodId: number) => Promise<void>;
  decrementQuantity: (foodId: number) => Promise<void>;
  clearCart: () => Promise<void>;

  // Derived cart information
  totalItems: number;
  totalPrice: number;
}

interface CartProviderProps {
  children: ReactNode;
}

// Context starts as undefined so we can detect
// if useCart() is used outside CartProvider.
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  /**
   * Add food to cart.
   *
   * If the food already exists, increase its quantity.
   * Otherwise create a new CartItem with quantity = 1.
   */
  const addToCart = useCallback(async (food: Food) => {
    try {
      const response = await addToCartApi(food.id, 1);

      setCartItems(response.items);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  }, []);

  //getCart code
  const fetchCart = useCallback(async () => {
    try {
      const response = await getCart();

      setCartItems(response.items);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  }, []);

  /**
   * Completely remove an item from the cart.
   */
  const removeFromCart = useCallback(async (foodId: number) => {
    try {
      const response = await removeCartItem(foodId);

      setCartItems(response.items);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  }, []);

  /**
   * Set an exact quantity.
   *
   * Quantity <= 0 means the item should be removed.
   */
  const updateQuantity = useCallback(
    async (foodId: number, quantity: number) => {
      try {
        if (quantity <= 0) {
          const response = await removeCartItem(foodId);

          setCartItems(response.items);

          return;
        }

        const response = await updateCartItem(foodId, quantity);

        setCartItems(response.items);
      } catch (error) {
        console.error("Failed to update quantity:", error);
      }
    },
    [],
  );

  /**
   * Increase quantity by one.
   */
  const incrementQuantity = useCallback(
    async (foodId: number) => {
      const item = cartItems.find((item) => item.id === foodId);

      if (!item) return;

      await updateQuantity(foodId, item.quantity + 1);
    },
    [cartItems, updateQuantity],
  );

  /**
   * Decrease quantity by one.
   *
   * If quantity becomes zero, remove the item.
   */
  const decrementQuantity = useCallback(
    async (foodId: number) => {
      const item = cartItems.find((item) => item.id === foodId);

      if (!item) return;

      await updateQuantity(foodId, item.quantity - 1);
    },
    [cartItems, updateQuantity],
  );
  /**
   * Empty the entire cart.
   */
  const clearCart = useCallback(async () => {
    try {
      const response = await clearCartApi();

      setCartItems(response.items);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
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
    return cartItems.reduce((total, item) => total + item.quantity, 0);
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
      (total, item) => total + item.price * item.quantity,
      0,
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
      fetchCart,
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
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
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
    throw new Error("useCart must be used inside a CartProvider");
  }

  return context;
};
