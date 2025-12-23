import api from "./axios";

const API_URL = "/cotizacion/detallecotizacion";

export const getDetalleCotizacion = () => api.get(API_URL);
export const getDetalleCotizacionById = (id) => api.get(`${API_URL}/${id}`);
export const createDetalleCotizacion = (data) => api.post(API_URL, data);
export const updateDetalleCotizacion = (id, data) => api.put(`${API_URL}/${id}`, data);
export const deleteDetalleCotizacion = (id) => api.delete(`${API_URL}/${id}`);
