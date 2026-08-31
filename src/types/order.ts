import { CartItem } from "./food";

export type OrderStatus =
  | "Preparing"
  | "On the way"
  | "Delivered"
  | "Cancelled";

export interface OrderItem extends CartItem {}

export interface Order {
  id: string;
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