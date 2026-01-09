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


export default api;
