import api from "./api";
import type { Address, AddressRequest } from "../types/address";

export const getAddresses = async (userId: number): Promise<Address[]> => {
  const response = await api.get(`/api/address/${userId}`);

  return response.data;
};

export const getAddressById = async (
  addressId: number,
  userId: number,
): Promise<Address> => {
  const response = await api.get(
    `/api/address/getAddressById/${userId}/${addressId}`,
  );

  return response.data;
};

export const createAddress = async (
  userId: number,
  data: AddressRequest,
): Promise<number> => {
  console.log("CREATE ADDRESS userId:", userId);

  console.log("CREATE ADDRESS payload:", JSON.stringify(data, null, 2));

  const response = await api.post(`/api/address/save/${userId}`, data);

  console.log("CREATE ADDRESS response:", response.data);
  console.log(
    "CREATE ADDRESS RESPONSE:",
    JSON.stringify(response.data, null, 2),
  );

  return response.data.data;
};

export const updateAddress = async (
  userId: number,
  addressId: number,
  data: AddressRequest,
): Promise<Address> => {
  const response = await api.put(
    `/api/address/updateAddress/${userId}/${addressId}`,
    data,
  );

  return response.data;
};

export const deleteAddress = async (
  userId: number,
  addressId: number,
): Promise<void> => {
  await api.delete(`/api/address/deleteAddress/${userId}/${addressId}`);
};
