import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  cancelOrder as cancelOrderApi,
  createOrder as createOrderApi,
  getOrderById as getOrderByIdApi,
  getOrders as getOrdersApi,
  getOrderStatus as getOrderStatusApi,
} from "../services/orderApi";
import { CreateOrderRequest, Order, OrderStatusResponse } from "../types/order";

interface OrderContextType {
  orders: Order[];

  loading: boolean;

  createOrder: (
    userId: number,
    orderData: CreateOrderRequest,
  ) => Promise<Order>;

  fetchOrders: (userId: number) => Promise<void>;

  getOrderById: (userId: number, orderId: number) => Promise<Order>;

  getOrderStatus: (
    userId: number,
    orderId: number,
  ) => Promise<OrderStatusResponse>;

  cancelOrder: (userId: number, orderId: number) => Promise<Order>;

  clearOrders: () => void;
}

interface OrderProviderProps {
  children: ReactNode;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: OrderProviderProps) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Create a new order using backend API.
   */
  const createOrder = useCallback(
    async (userId: number, orderData: CreateOrderRequest): Promise<Order> => {
      try {
        setLoading(true);

        const newOrder = await createOrderApi(userId, orderData);

        /*
         * Add newly created order
         * at the beginning of the list.
         */
        setOrders((currentOrders) => [newOrder, ...currentOrders]);

        return newOrder;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * Get all orders of logged-in user.
   */
  const fetchOrders = useCallback(async (userId: number): Promise<void> => {
    try {
      setLoading(true);

      const userOrders = await getOrdersApi(userId);

      setOrders(userOrders);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get one order by ID.
   */
  const getOrderById = useCallback(
    async (userId: number, orderId: number): Promise<Order> => {
      return await getOrderByIdApi(userId, orderId);
    },
    [],
  );

  /**
   * Get current order status.
   */
  const getOrderStatus = useCallback(
    async (userId: number, orderId: number): Promise<OrderStatusResponse> => {
      return await getOrderStatusApi(userId, orderId);
    },
    [],
  );

  /**
   * Cancel an order.
   */
  const cancelOrder = useCallback(
    async (userId: number, orderId: number): Promise<Order> => {
      const updatedOrder = await cancelOrderApi(userId, orderId);

      /*
       * Update the order in local state.
       */
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order,
        ),
      );

      return updatedOrder;
    },
    [],
  );

  /**
   * Clear local order state.
   */
  const clearOrders = useCallback(() => {
    setOrders([]);
  }, []);

  const value = useMemo(
    () => ({
      orders,
      loading,

      createOrder,
      fetchOrders,
      getOrderById,
      getOrderStatus,
      cancelOrder,
      clearOrders,
    }),

    [
      orders,
      loading,

      createOrder,
      fetchOrders,
      getOrderById,
      getOrderStatus,
      cancelOrder,
      clearOrders,
    ],
  );

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);

  if (context === undefined) {
    throw new Error("useOrders must be used inside an OrderProvider");
  }

  return context;
};
