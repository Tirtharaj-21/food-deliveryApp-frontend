import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { Order, OrderItem } from "../types/order";

interface CreateOrderParams {
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  deliveryAddress: string;
  paymentMethod: string;
}

interface OrderContextType {
  orders: Order[];

  createOrder: (
    orderData: CreateOrderParams
  ) => Order;

  getOrderById: (orderId: string) => Order | undefined;

  clearOrders: () => void;
}

interface OrderProviderProps {
  children: ReactNode;
}

const OrderContext = createContext<
  OrderContextType | undefined
>(undefined);

export const OrderProvider = ({
  children,
}: OrderProviderProps) => {
  const [orders, setOrders] = useState<Order[]>([]);

  /**
   * Creates a new order from the checkout information.
   *
   * In a real application this would normally call
   * an API. For this assessment we generate the order
   * locally because we're using mock data only.
   */
  const createOrder = useCallback(
    (orderData: CreateOrderParams): Order => {
      const newOrder: Order = {
        id: `ORD-${Date.now()}`,
        items: orderData.items,

        subtotal: orderData.subtotal,
        deliveryFee: orderData.deliveryFee,
        tax: orderData.tax,
        total: orderData.total,

        deliveryAddress:
          orderData.deliveryAddress,

        paymentMethod:
          orderData.paymentMethod,

        status: "Preparing",

        createdAt: new Date().toISOString(),
      };

      setOrders((currentOrders) => [
        newOrder,
        ...currentOrders,
      ]);

      return newOrder;
    },
    []
  );

  /**
   * Finds an order by its ID.
   */
  const getOrderById = useCallback(
    (orderId: string) => {
      return orders.find(
        (order) => order.id === orderId
      );
    },
    [orders]
  );

  /**
   * Useful for development/testing.
   */
  const clearOrders = useCallback(() => {
    setOrders([]);
  }, []);

  const value = useMemo(
    () => ({
      orders,
      createOrder,
      getOrderById,
      clearOrders,
    }),
    [
      orders,
      createOrder,
      getOrderById,
      clearOrders,
    ]
  );

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);

  if (context === undefined) {
    throw new Error(
      "useOrders must be used inside an OrderProvider"
    );
  }

  return context;
};