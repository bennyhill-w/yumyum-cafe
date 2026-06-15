import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request if it exists
api.interceptors.request.use(
  (config) => {
    // Try user token first, fall back to admin token
    const userToken = localStorage.getItem("yumyum_user_token");
    const adminToken = localStorage.getItem("yumyum_admin_token");
    const token = userToken || adminToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Global response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAdminRoute = error.config?.url?.includes("/auth/");
      if (isAdminRoute) {
        localStorage.removeItem("yumyum_admin_token");
      } else {
        localStorage.removeItem("yumyum_user_token");
      }
    }
    return Promise.reject(error);
  },
);

export default api;
