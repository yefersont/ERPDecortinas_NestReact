import api from "./axios";

const API_URL = '/ventas';

export const getVentas = () => api.get(API_URL);
export const getVenta = (id) => api.get(`${API_URL}/${id}`);
export const createVenta = (data) => api.post(API_URL, data);
export const updateVenta = (id,data) => api.patch(`${API_URL}/${id}`, data);
export const deleteVenta = (id) => api.delete(`${API_URL}/${id}`);