import axios from "axios";
import { BASE_URL } from "../config/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// TEMPORARILY disabled JWT interceptor.
// We are testing API connectivity first.

export default api;
