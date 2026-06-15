import api from "./api";

export const getContacts = (params) => api.get("/contact", { params });
export const markRead = (id) => api.patch(`/contact/${id}/read`);
export const deleteContact = (id) => api.delete(`/contact/${id}`);