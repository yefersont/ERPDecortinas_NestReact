import React, { createContext, useContext, useState, useEffect } from 'react';
import * as AuthApi from '../api/AuthApi';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Cargando...');
  const navigate = useNavigate();

  // Intervalo para renovar el access token automáticamente
  const [refreshInterval, setRefreshInterval] = useState(null);

  // Función para iniciar la renovación automática del token
  const startTokenRefresh = () => {
    // Limpiar intervalo anterior si existe
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }

    // Renovar el token cada 14 minutos (antes de que expire a los 15 minutos)
    const interval = setInterval(async () => {
      try {
        const data = await AuthApi.refreshToken();
        const responseData = data.data || data;
        setAccessToken(responseData.accessToken);
        setUser(responseData.user);
      } catch (error) {
        console.error('Error al renovar token:', error);
        // Si falla la renovación, cerrar sesión
        await handleLogout();
      }
    }, 14 * 60 * 1000); // 14 minutos

    setRefreshInterval(interval);
  };

  // Función para detener la renovación automática
  const stopTokenRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  };

  // Intentar restaurar la sesión al cargar la aplicación
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Intentar renovar el access token usando el refresh token (cookie)
        const data = await AuthApi.refreshToken();
        const responseData = data.data || data;
        setAccessToken(responseData.accessToken);
        setUser(responseData.user);
        startTokenRefresh();
      } catch (error) {
        // No hay sesión activa o el refresh token expiró
        console.log('No hay sesión activa');
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Limpiar intervalo al desmontar
    return () => stopTokenRefresh();
  }, []);

  // Sincronizar el access token con axios cada vez que cambie
  useEffect(() => {
    setAuthToken(accessToken);
  }, [accessToken]);

  // Login
  const handleLogin = async (email, password) => {
    try {
      const data = await AuthApi.login(email, password);
      
      // Ajuste para el ResponseInterceptor que envuelve la data
      const responseData = data.data || data;

      setAccessToken(responseData.accessToken);
      setUser(responseData.user);
      
      startTokenRefresh();
      // navigate('/'); // Eliminamos navegación automática para manejarla en el Login con Loader
      return { success: true };
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al iniciar sesión',
      };
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      setLoadingText('Cerrando sesión...');
      setLoading(true);
      // Simular espera para mostrar el loader
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await AuthApi.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      stopTokenRefresh();
      setAccessToken(null);
      setUser(null);
      setLoading(false);
      setLoadingText('Cargando...');
      navigate('/login');
    }
  };

  // Renovar token manualmente (útil para interceptores de axios)
  const refreshAccessToken = async () => {
    try {
      const data = await AuthApi.refreshToken();
      const responseData = data.data || data;
      setAccessToken(responseData.accessToken);
      setUser(responseData.user);
      return responseData.accessToken;
    } catch (error) {
      console.error('Error al renovar token:', error);
      await handleLogout();
      throw error;
    }
  };

  const value = {
    user,
    accessToken,
    loading,
    loadingText,
    login: handleLogin,
    logout: handleLogout,
    refreshAccessToken,
    isAuthenticated: !!user && !!accessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
