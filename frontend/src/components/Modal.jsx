import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md', // 'sm', 'md', 'lg', 'xl', 'full'
  showCloseButton = true,
  closeOnOverlayClick = true,
  footer = null,
}) => {
  const { isDarkMode } = useTheme();

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Tamaños del modal
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl mx-4',
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={handleOverlayClick}
    >
      {/* Overlay con blur */}
      <div
        className={`absolute inset-0 transition-all duration-300 ${
          isDarkMode
            ? 'bg-black/70 backdrop-blur-sm'
            : 'bg-black/50 backdrop-blur-sm'
        }`}
      />

      {/* Modal Container */}
      <div
        className={`
          relative w-full ${sizeClasses[size]} 
          animate-slideUp
        `}
      >
        {/* Modal Content */}
        <div
          className={`
            relative rounded-2xl shadow-2xl
            ${
              isDarkMode
                ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border border-gray-800'
                : 'bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200'
            }
          `}
          style={{
            boxShadow: isDarkMode
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Efecto de brillo en la parte superior */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: isDarkMode
                ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
            }}
          />

          {/* Header */}
          {title && (
            <div
              className={`
                flex items-center justify-between px-6 py-4 border-b
                ${
                  isDarkMode
                    ? 'border-gray-800'
                    : 'border-gray-200'
                }
              `}
            >
              <h2
                className={`
                  text-xl font-bold
                  ${isDarkMode ? 'text-white' : 'text-gray-900'}
                `}
              >
                {title}
              </h2>

              {showCloseButton && (
                <button
                  onClick={onClose}
                  className={`
                    p-2 rounded-lg transition-all duration-200
                    ${
                      isDarkMode
                        ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'
                        : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                    }
                  `}
                  aria-label="Cerrar modal"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div
              className={`
                px-6 py-4 border-t
                ${
                  isDarkMode
                    ? 'border-gray-800 bg-gray-900/50'
                    : 'border-gray-200 bg-gray-50/50'
                }
              `}
            >
              {footer}
            </div>
          )}
        </div>
      </div>

      {/* Estilos para animaciones y scrollbar personalizado */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        /* Scrollbar personalizado */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDarkMode ? '#1f2937' : '#f3f4f6'};
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? '#4b5563' : '#d1d5db'};
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? '#6b7280' : '#9ca3af'};
        }
      `}</style>
    </div>
  );
};

export default Modal;