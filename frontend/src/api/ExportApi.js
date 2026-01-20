import fileApi from "./axios";

const API_URL = "/exports";

export const exportCotizacionesToExcel = () => fileApi.get(`${API_URL}/cotizacionesToExcel`, { responseType: "blob" });
export const exportVentasToExcel = () => fileApi.get(`${API_URL}/ventasToExcel`, { responseType: "blob" });
export const expoetClientesToExcel = () => fileApi.get(`${API_URL}/clientesToExcel`, { responseType: "blob" });