import api from "./axios";

const API_URL = '/estadisticas';

export const getEstadisticasResumen = () => api.get(`${API_URL}/resumen`);
export const getEstadisticasVentasPorMes = () => api.get(`${API_URL}/ventasPorMes`);
export const getEstadisticasProductosMasVendidos = () => api.get(`${API_URL}/productosMasVendidos`);
export const getEstadisticasClientesConMayorDeuda = () => api.get(`${API_URL}/clientesConMayorDeuda`);
export const getEstadisticasClientesConMasCompras = () => api.get(`${API_URL}/clientesConMasCompras`);
export const getEstadisticasTiempoPromedioCierre = () => api.get(`${API_URL}/tiempoPromedioCierre`);
