import api from "./api";

export const register = (data) => api.post("/users/register", data);
export const login = (data) => api.post("/users/login", data);
export const getMe = () => api.get("/users/me");
export const updateProfile = (data) => api.patch("/users/profile", data);
export const changePassword = (data) => api.patch("/users/password", data);
export const getUserOrders = () => api.get("/users/orders");
export const getUserReservations = () => api.get("/users/reservations");
export const deleteAccount = (data) => api.delete("/users/account", { data });
export const googleAuth = (credential) =>
  api.post("/users/google-auth", { credential });

export const sendOTP = (email) => api.post("/users/send-otp", { email });

export const verifyOTP = (email, otp) =>
  api.post("/users/verify-otp", { email, otp });

export const getLoyaltyAccount = () => api.get("/loyalty/account");
export const getLoyaltyTransactions = () => api.get("/loyalty/transactions");
export const calculateRedemption = (data) =>
  api.post("/loyalty/calculate", data);
export const redeemPoints = (data) => api.post("/loyalty/redeem", data);
