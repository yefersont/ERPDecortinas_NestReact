// components/Toast.jsx
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Hook personalizado para manejar las notificaciones
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return { toasts, showToast, removeToast };
};

// Componente Toast individual
const ToastItem = ({ toast, onRemove }) => {
  const { isDarkMode } = useTheme();
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  useEffect(() => {
    if (toast.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  const variants = {
    success: {
      icon: CheckCircle,
      bgDark: 'bg-gradient-to-r from-green-900/90 to-green-800/90',
      bgLight: 'bg-gradient-to-r from-green-50 to-green-100',
      borderDark: 'border-green-500',
      borderLight: 'border-green-400',
      iconColorDark: 'text-green-400',
      iconColorLight: 'text-green-600',
      textDark: 'text-green-200',
      textLight: 'text-green-800',
      progressDark: 'bg-green-500',
      progressLight: 'bg-green-500',
    },
    error: {
      icon: XCircle,
      bgDark: 'bg-gradient-to-r from-red-900/90 to-red-800/90',
      bgLight: 'bg-gradient-to-r from-red-50 to-red-100',
      borderDark: 'border-red-500',
      borderLight: 'border-red-400',
      iconColorDark: 'text-red-400',
      iconColorLight: 'text-red-600',
      textDark: 'text-red-200',
      textLight: 'text-red-800',
      progressDark: 'bg-red-500',
      progressLight: 'bg-red-500',
    },
    warning: {
      icon: AlertCircle,
      bgDark: 'bg-gradient-to-r from-yellow-900/90 to-yellow-800/90',
      bgLight: 'bg-gradient-to-r from-yellow-50 to-yellow-100',
      borderDark: 'border-yellow-500',
      borderLight: 'border-yellow-400',
      iconColorDark: 'text-yellow-400',
      iconColorLight: 'text-yellow-600',
      textDark: 'text-yellow-200',
      textLight: 'text-yellow-800',
      progressDark: 'bg-yellow-500',
      progressLight: 'bg-yellow-500',
    },
    info: {
      icon: Info,
      bgDark: 'bg-gradient-to-r from-blue-900/90 to-blue-800/90',
      bgLight: 'bg-gradient-to-r from-blue-50 to-blue-100',
      borderDark: 'border-blue-500',
      borderLight: 'border-blue-400',
      iconColorDark: 'text-blue-400',
      iconColorLight: 'text-blue-600',
      textDark: 'text-blue-200',
      textLight: 'text-blue-800',
      progressDark: 'bg-blue-500',
      progressLight: 'bg-blue-500',
    },
  };

  const variant = variants[toast.type] || variants.success;
  const Icon = variant.icon;

  return (
    <div
      className={`
        relative flex items-start gap-3 p-4 pr-12 rounded-xl border-l-4 
        shadow-2xl backdrop-blur-sm min-w-[320px] max-w-md
        ${isExiting ? 'animate-slideOut' : 'animate-slideIn'}
        ${isDarkMode ? variant.bgDark : variant.bgLight}
        ${isDarkMode ? variant.borderDark : variant.borderLight}
      `}
      style={{
        boxShadow: isDarkMode
          ? '0 10px 40px -10px rgba(0, 0, 0, 0.8)'
          : '0 10px 40px -10px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Icono */}
      <div className="flex-shrink-0 mt-0.5">
        <Icon
          size={24}
          className={isDarkMode ? variant.iconColorDark : variant.iconColorLight}
        />
      </div>

      {/* Mensaje */}
      <div className="flex-1">
        <p
          className={`
            text-sm font-medium leading-relaxed
            ${isDarkMode ? variant.textDark : variant.textLight}
          `}
        >
          {toast.message}
        </p>
      </div>

      {/* Botón cerrar */}
      <button
        onClick={handleClose}
        className={`
          absolute top-3 right-3 p-1 rounded-lg transition-all duration-200
          ${
            isDarkMode
              ? 'hover:bg-white/10 text-gray-400 hover:text-white'
              : 'hover:bg-black/10 text-gray-500 hover:text-gray-700'
          }
        `}
      >
        <X size={16} />
      </button>

      {/* Barra de progreso */}
      {toast.duration > 0 && (
        <div
          className={`
            absolute bottom-0 left-0 right-0 h-1 rounded-b-xl overflow-hidden
            ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}
          `}
        >
          <div
            className={`
              h-full animate-progress
              ${isDarkMode ? variant.progressDark : variant.progressLight}
            `}
            style={{
              animationDuration: `${toast.duration}ms`,
            }}
          />
        </div>
      )}
    </div>
  );
};

// Componente contenedor de Toasts
const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <div className="flex flex-col gap-3 pointer-events-auto">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .animate-slideOut {
          animation: slideOut 0.3s ease-in;
        }

        .animate-progress {
          animation: progress linear;
        }
      `}</style>
    </div>
  );
};

export default ToastContainer;