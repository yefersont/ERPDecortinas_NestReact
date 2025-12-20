import api from './axios';


const API_URL = '/deudores';

export const getDeudores = () => api.get(API_URL);
export const getDeudor = (id) => api.get(`${API_URL}/${id}`);
export const createDeudor = (data) => api.post(API_URL, data);
export const updateDeudor = (id,data) => api.patch(`${API_URL}/${id}`, data);
export const deleteDeudor = (id) => api.delete(`${API_URL}/${id}`);