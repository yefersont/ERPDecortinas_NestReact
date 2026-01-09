import api from "./axios";

const API_URL = "/exports";

export const exportCotizacionesToExcel = () => api.get(`${API_URL}/cotizacionesToExcel`);