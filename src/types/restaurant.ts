export interface Restaurant {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  address: string;
  phone: string;
  city: string;
  cuisine: string | null;
  rating: number;
  deliveryTime: string | null;
  deliveryFee: number | null;
  createdAt: string | null;
  isActive: boolean;
}
