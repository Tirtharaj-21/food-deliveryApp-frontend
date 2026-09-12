import axios from "axios";
import { BASE_URL } from "../config/api";
import type { Profile, UpdateProfileRequest } from "../types/profile";

export const getProfile = async (userId: number): Promise<Profile> => {
  const response = await axios.get(`${BASE_URL}/api/profile/${userId}`);

  return response.data;
};

export const updateProfile = async (
  userId: number,
  data: UpdateProfileRequest,
): Promise<Profile> => {
  const response = await axios.put(`${BASE_URL}/api/profile/${userId}`, data);

  return response.data;
};
