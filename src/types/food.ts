export interface Food {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isPopular?: boolean;
}

export interface CartItem extends Food {
  quantity: number;
}