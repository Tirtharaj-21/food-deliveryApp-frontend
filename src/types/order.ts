import { CartItem } from "./food";

export type OrderStatus =
  | "Preparing"
  | "On the way"
  | "Delivered"
  | "Cancelled";

export interface OrderItem extends CartItem {}

export interface Order {
  id: number;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  deliveryAddress: string;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
}
/**
 * Item sent to backend while creating an order.
 */
export interface CreateOrderItemRequest {
  foodId: number;
  quantity: number;
}

/**
 * Request sent to backend.
 */
export interface CreateOrderRequest {
  items: CreateOrderItemRequest[];
  deliveryAddress: string;
  paymentMethod: string;
}

/**
 * Response for order status API.
 */
export interface OrderStatusResponse {
  orderId: number;
  status: OrderStatus;
}
