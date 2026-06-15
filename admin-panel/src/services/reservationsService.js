import api from "./api";

export const getReservations = (params) => api.get("/reservations", { params });
export const updateReservationStatus = (id, status) =>
  api.patch(`/reservations/${id}/status`, { status });
export const getReservationById = (id) => api.get(`/reservations/${id}`);