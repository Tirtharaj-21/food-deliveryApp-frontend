export interface Address {
  id: number;
  userId: number;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

export interface AddressRequest {
  label?: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
}
