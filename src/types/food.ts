export interface Food {
  id: number;
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
