import { Food } from "../types/food";

export const foods: Food[] = [
  // Urban Bites
  {
    id: "food-1",
    restaurantId: "restaurant-1",
    name: "Margherita Pizza",
    description:
      "Classic Italian pizza with tomato sauce, fresh mozzarella and basil.",
    price: 12.99,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900",
    category: "Pizza",
    isPopular: true,
  },
  {
    id: "food-2",
    restaurantId: "restaurant-1",
    name: "Pepperoni Pizza",
    description:
      "Crispy crust topped with tomato sauce, mozzarella and premium pepperoni.",
    price: 15.99,
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=900",
    category: "Pizza",
    isPopular: true,
  },
  {
    id: "food-3",
    restaurantId: "restaurant-1",
    name: "Creamy Alfredo Pasta",
    description:
      "Fresh pasta tossed in a rich and creamy parmesan sauce.",
    price: 14.49,
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900",
    category: "Pasta",
  },

  // Spice Garden
  {
    id: "food-4",
    restaurantId: "restaurant-2",
    name: "Chicken Biryani",
    description:
      "Fragrant basmati rice cooked with tender chicken and aromatic spices.",
    price: 13.99,
    image:
      "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=900",
    category: "Biryani",
    isPopular: true,
  },
  {
    id: "food-5",
    restaurantId: "restaurant-2",
    name: "Butter Chicken",
    description:
      "Tender chicken cooked in a creamy tomato and butter sauce.",
    price: 15.49,
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=900",
    category: "Curry",
    isPopular: true,
  },
  {
    id: "food-6",
    restaurantId: "restaurant-2",
    name: "Paneer Tikka",
    description:
      "Grilled Indian cottage cheese marinated with yogurt and spices.",
    price: 11.99,
    image:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=900",
    category: "Indian",
  },

  // Burger House
  {
    id: "food-7",
    restaurantId: "restaurant-3",
    name: "Classic Cheeseburger",
    description:
      "Juicy beef patty with cheddar cheese, lettuce, tomato and house sauce.",
    price: 11.99,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900",
    category: "Burgers",
    isPopular: true,
  },
  {
    id: "food-8",
    restaurantId: "restaurant-3",
    name: "Crispy Chicken Burger",
    description:
      "Crispy fried chicken with lettuce, pickles and creamy sauce.",
    price: 12.49,
    image:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=900",
    category: "Burgers",
  },

  // Sushi World
  {
    id: "food-9",
    restaurantId: "restaurant-4",
    name: "Salmon Sushi",
    description:
      "Fresh salmon served over seasoned sushi rice.",
    price: 16.99,
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=900",
    category: "Sushi",
    isPopular: true,
  },
  {
    id: "food-10",
    restaurantId: "restaurant-4",
    name: "California Roll",
    description:
      "Classic roll with crab, avocado and cucumber.",
    price: 13.99,
    image:
      "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=900",
    category: "Sushi",
  },

  // Green Bowl
  {
    id: "food-11",
    restaurantId: "restaurant-5",
    name: "Mediterranean Bowl",
    description:
      "Fresh greens, chickpeas, cucumber, tomato, olives and feta.",
    price: 12.99,
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900",
    category: "Salads",
    isPopular: true,
  },
  {
    id: "food-12",
    restaurantId: "restaurant-5",
    name: "Avocado Power Bowl",
    description:
      "Avocado, quinoa, greens, roasted vegetables and seeds.",
    price: 13.49,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900",
    category: "Healthy",
  },
];