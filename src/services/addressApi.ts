import axios from "axios";
import type { Address, AddressRequest } from "../types/address";

import { BASE_URL } from "../config/api";

export const getAddresses = async (userId: number): Promise<Address[]> => {
  const response = await axios.get(`${BASE_URL}/api/address/user/${userId}`);

  return response.data;
};

export const getAddressById = async (addressId: number): Promise<Address> => {
  const response = await axios.get(`${BASE_URL}/api/address/${addressId}`);

  return response.data;
};

export const createAddress = async (
  userId: number,
  data: AddressRequest,
): Promise<Address> => {
  const response = await axios.post(
    `${BASE_URL}/api/address/user/${userId}`,
    data,
  );

  return response.data;
};

export const updateAddress = async (
  addressId: number,
  data: AddressRequest,
): Promise<Address> => {
  const response = await axios.put(
    `${BASE_URL}/api/address/${addressId}`,
    data,
  );

  return response.data;
};

export const deleteAddress = async (addressId: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/api/address/${addressId}`);
};
