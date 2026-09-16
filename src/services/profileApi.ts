import api from "./api";
import { getAuthUser } from "./storage";
import type { Profile, UpdateProfileRequest } from "../types/profile";

export const getProfile = async (): Promise<Profile> => {
  const user = await getAuthUser();

  if (!user?.email) {
    throw new Error("User email not found");
  }

  const response = await api.get(`/api/me/${encodeURIComponent(user.email)}`);

  return response.data;
};

export const updateProfile = async (
  userId: number,
  data: UpdateProfileRequest,
): Promise<Profile> => {
  const response = await api.put(`/api/update/profile/${userId}`, data);

  return response.data;
};
