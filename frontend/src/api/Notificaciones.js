import api from "./axios";

const API_URL = '/notificaciones';

export const getNotificacionesDeudores = () => api.get(API_URL);