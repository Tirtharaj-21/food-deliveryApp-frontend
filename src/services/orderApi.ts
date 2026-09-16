import { BASE_URL } from "../config/api";

import { CreateOrderRequest, Order, OrderStatusResponse } from "../types/order";

/**
 * Create a new order
 */
export const createOrder = async (
  userId: number,
  orderData: CreateOrderRequest,
): Promise<Order> => {
  const url = `${BASE_URL}/api/orders/${userId}/save`;

  console.log("Create Order API URL:", url);
  console.log("Create Order Payload:", orderData);

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(orderData),
  });

  console.log("Create Order API Status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();

    console.log("Create Order API Error:", errorText);

    throw new Error(`Failed to create order: ${response.status}`);
  }

  const responseData = await response.json();

  console.log("Create Order API Response:", responseData);

  /*
   * Your current backend returns only:
   *
   * {
   *   "success": true,
   *   "data": 101
   * }
   *
   * If you change the backend to return the complete
   * OrderResponse, return responseData directly.
   */

  return responseData;
};

/**
 * Get all orders of a user
 */
export const getOrders = async (userId: number): Promise<Order[]> => {
  const url = `${BASE_URL}/api/orders/${userId}`;

  console.log("Get Orders API URL:", url);

  const response = await fetch(url);

  console.log("Get Orders API Status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();

    console.log("Get Orders API Error:", errorText);

    throw new Error(`Failed to fetch orders: ${response.status}`);
  }

  const responseData = await response.json();

  console.log("Get Orders API Response:", responseData);

  return responseData;
};

/**
 * Get one order by ID
 */
export const getOrderById = async (
  userId: number,
  orderId: number,
): Promise<Order> => {
  const url = `${BASE_URL}/api/orders/${userId}/${orderId}`;

  console.log("Get Order By ID URL:", url);

  const response = await fetch(url);

  console.log("Get Order By ID Status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();

    console.log("Get Order By ID Error:", errorText);

    throw new Error(`Failed to fetch order: ${response.status}`);
  }

  const responseData = await response.json();

  console.log("Get Order By ID Response:", responseData);

  return responseData;
};

/**
 * Get order status
 */
export const getOrderStatus = async (
  userId: number,
  orderId: number,
): Promise<OrderStatusResponse> => {
  const url = `${BASE_URL}/api/orders/${userId}/${orderId}/status`;

  console.log("Get Order Status URL:", url);

  const response = await fetch(url);

  console.log("Get Order Status API Status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();

    console.log("Get Order Status API Error:", errorText);

    throw new Error(`Failed to fetch order status: ${response.status}`);
  }

  const responseData = await response.json();

  console.log("Get Order Status Response:", responseData);

  return responseData;
};

/**
 * Cancel order
 */
export const cancelOrder = async (
  userId: number,
  orderId: number,
): Promise<Order> => {
  const url = `${BASE_URL}/api/orders/${userId}/${orderId}/cancel`;

  console.log("Cancel Order API URL:", url);

  const response = await fetch(url, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("Cancel Order API Status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();

    console.log("Cancel Order API Error:", errorText);

    throw new Error(`Failed to cancel order: ${response.status}`);
  }

  const responseData = await response.json();

  console.log("Cancel Order API Response:", responseData);

  return responseData;
};
