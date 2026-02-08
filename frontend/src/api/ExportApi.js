import fileApi from "./axios";

const API_URL = "/exports";

export const exportCotizacionesToExcel = () => fileApi.get(`${API_URL}/cotizacionesToExcel`, { responseType: "blob" });
export const exportVentasToExcel = () => fileApi.get(`${API_URL}/ventasToExcel`, { responseType: "blob" });
export const descargarFactura = (idVenta) => fileApi.get(`${API_URL}/ventaFacturaPDF/${idVenta}`, { responseType: 'blob' });