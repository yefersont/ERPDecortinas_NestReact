import fileApi from "./axios";

const API_URL = "/exports";

export const exportCotizacionesToExcel = () => fileApi.get(`${API_URL}/cotizacionesToExcel`, { responseType: "blob" });