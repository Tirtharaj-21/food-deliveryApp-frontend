import { CartItem } from "./food";

export interface CartResponse {
  cartId: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface AddToCartRequest {
  foodItemId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
