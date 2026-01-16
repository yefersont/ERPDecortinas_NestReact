import api from './axios';

// Login: autentica al usuario y recibe access token
// El refresh token se establece automáticamente como httpOnly cookie
export const login = async (email, password) => {
  const response = await api.post(
    '/auth/login',
    { email, password },
    { withCredentials: true } // Importante: enviar cookies
  );
  return response.data;
};

// Refresh: renueva el access token usando el refresh token (cookie)
export const refreshToken = async () => {
  const response = await api.post(
    '/auth/refresh',
    {},
    { withCredentials: true } // Importante: enviar cookies
  );
  return response.data;
};

// Logout: limpia la cookie del refresh token
export const logout = async () => {
  const response = await api.post(
    '/auth/logout',
    {},
    { withCredentials: true } // Importante: enviar cookies
  );
  return response.data;
};
