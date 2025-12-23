import api from "../api/axios";

const API_URL = "/tipo-producto";

export const getTipoProductos = () => api.get(API_URL);
export const getTipoProducto = (id) => api.get(`${API_URL}/${id}`);
export const createTipoProducto = (data) => api.post(API_URL, data);
export const updateTipoProducto = (id,data) => api.patch(`${API_URL}/${id}`, data);
export const deleteTipoProducto = (id) => api.delete(`${API_URL}/${id}`);
