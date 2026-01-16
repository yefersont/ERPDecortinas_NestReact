import axios from "axios";
const API_URL = "http://localhost:3000";


// Para respuestas de tipo json 
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// Para respuestas de tipo blob (para archivos)
export const fileApi = axios.create({
  baseURL: API_URL,
  responseType: 'blob',
});


// Variable local para almacenar el token
let accessToken = null;

export const setAuthToken = (token) => {
  accessToken = token;
};

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
