import BASE_URL from "./api";

// GET CART
export async function getCart() {
  const response = await fetch(`${BASE_URL}/api/cart`);

  if (!response.ok) {
    throw new Error("Failed to fetch cart");
  }

  return response.json();
}

// ADD TO CART
export async function addToCart(foodItemId: number, quantity: number) {
  const response = await fetch(`${BASE_URL}/api/cart/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      foodItemId,
      quantity,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add item to cart");
  }

  return response.json();
}

// UPDATE CART ITEM
export async function updateCartItem(foodItemId: number, quantity: number) {
  const response = await fetch(`${BASE_URL}/api/cart/items/${foodItemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quantity,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update cart item");
  }

  return response.json();
}

// DELETE CART ITEM
export async function removeCartItem(foodItemId: number) {
  const response = await fetch(`${BASE_URL}/api/cart/items/${foodItemId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to remove cart item");
  }

  return response.json();
}

// CLEAR CART
export async function clearCart() {
  const response = await fetch(`${BASE_URL}/api/cart`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to clear cart");
  }

  return response.json();
}
