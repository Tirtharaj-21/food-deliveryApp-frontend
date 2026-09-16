import axios from "axios";
import { BASE_URL } from "../config/api";
import { saveAuthUser } from "./storage";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
  role: string;
}

/**
 * Register new user
 */
export const registerUser = async (request: RegisterRequest): Promise<void> => {
  try {
    await api.post("/api/auth/register", request);
  } catch (error: any) {
    console.error(
      "Register API failed:",
      error?.response?.data || error.message,
    );

    throw error;
  }
};

/**
 *
 * Login user
 */
export const loginUser = async (
  request: LoginRequest,
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("/api/auth/login", request);

    const user = response.data;

    console.log("Login response:", user);

    await saveAuthUser(user);

    return user;
  } catch (error: any) {
    console.error("Login API failed:", error?.response?.data || error.message);

    throw error;
  }
};
