import api from "./axios";

const API_URL = '/cotizaciones';

export const getCotizaciones = () => api.get(API_URL);
export const getCotizacion = (id) => api.get(`${API_URL}/${id}`);
export const createCotizacion = (data) => api.post(API_URL, data);
export const updateCotizacion = (id,data) => api.patch(`${API_URL}/${id}`, data);
export const deleteCotizacion = (id) => api.delete(`${API_URL}/${id}`);