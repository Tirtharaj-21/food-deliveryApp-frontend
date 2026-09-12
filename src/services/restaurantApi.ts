import { BASE_URL } from "../config/api";
import { Food } from "../types/food";
import { Restaurant } from "../types/restaurant";
export const getRestaurants = async (): Promise<Restaurant[]> => {
  const response = await fetch(`${BASE_URL}/restaurant/getAllRestaurants`);

  if (!response.ok) {
    throw new Error("Failed to fetch restaurants");
  }

  return await response.json();
};

export const getRestaurantById = async (
  restaurantId: number,
): Promise<Restaurant> => {
  const response = await fetch(`${BASE_URL}/getRestaurantById/${restaurantId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch restaurant: ${response.status}`);
  }

  return await response.json();
};

export const getFoodsByRestaurantId = async (
  restaurantId: number,
): Promise<Food[]> => {
  const response = await fetch(`${BASE_URL}/getAll/foods/${restaurantId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch restaurant foods: ${response.status}`);
  }

  return await response.json();
};
