import api from "./axios";

const API_URL = "/clientes";

export const getClientes = () => api.get(API_URL);
export const getCliente = (id) => api.get(`${API_URL}/${id}`);
export const createCliente = (data) => api.post(API_URL, data);
export const updateCliente = (id, data) => api.patch(`${API_URL}/${id}`, data);
export const deleteCliente = (id) => api.delete(`${API_URL}/${id}`);
