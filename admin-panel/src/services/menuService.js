import api from "./api";

export const getAdminMenu = (params) => api.get("/menu/admin/all", { params });

export const createMenuItem = (data) => api.post("/menu", data);

export const updateMenuItem = (id, data) => api.patch(`/menu/${id}`, data);

export const deleteMenuItem = (id) => api.delete(`/menu/${id}`);

export const toggleAvailability = (id) => api.patch(`/menu/${id}/toggle`);

export const uploadMenuImage = (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return api.post("/menu/upload-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
