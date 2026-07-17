import api from "./api";

export const getOrders = (params) => api.get("/orders", { params });
export const updateOrderStatus = (id, payload) =>
  api.patch(`/orders/${id}/status`, payload);
export const getOrderById = (id) => api.get(`/orders/${id}`);
