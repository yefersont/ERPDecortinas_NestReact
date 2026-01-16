import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 
import { useTheme } from './context/ThemeContext';
// Componentes
import Navbar from './components/Navbar'; 
import PrivateRoute from './components/PrivateRoute';

// Páginas
import LoginPage from './pages/Login/LoginPage';
import ClientesPage from './pages/Clientes/ClientesPage';
import VentasPage from './pages/Ventas/VentasPage';
import CotizacionesPage from './pages/Cotizaciones/CotizacionesPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import DeudoresPage from './pages/deudores/DeudoresPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route element={<PrivateRoute />}>
        <Route path="/*" element={<ProtectedLayout />} />
      </Route>
    </Routes>
  );
}

function ProtectedLayout() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      
      <Navbar />

      <main className={`flex-1 overflow-auto transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/ventas" element={<VentasPage />} />
          <Route path="/cotizaciones" element={<CotizacionesPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/deudores" element={<DeudoresPage />} />
          <Route 
            path="*" 
            element={
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h1 className={`text-6xl font-bold mb-4 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>404</h1>
                  <p className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Página no encontrada</p>
                </div>
              </div>
            } 
          />
        </Routes>
      </main> 
      
    </div>
  );
}

export default App;