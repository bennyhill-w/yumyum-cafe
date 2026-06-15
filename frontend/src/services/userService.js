import api from "./api";

export const register = (data) => api.post("/users/register", data);
export const login = (data) => api.post("/users/login", data);
export const getMe = () => api.get("/users/me");
export const updateProfile = (data) => api.patch("/users/profile", data);
export const changePassword = (data) => api.patch("/users/password", data);
export const getUserOrders = () => api.get("/users/orders");
export const getUserReservations = () => api.get("/users/reservations");
export const deleteAccount = (data) => api.delete("/users/account", { data });
