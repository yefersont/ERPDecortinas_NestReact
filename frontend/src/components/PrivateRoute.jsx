import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export default function PrivateRoute() {
  const { isAuthenticated, loading, loadingText } = useAuth();

  if (loading) {
    return <Loader text={loadingText} fullScreen={loadingText === 'Cerrando sesión...'} />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
