import React, { useState, createContext, useContext } from 'react';
import { X, AlertTriangle, Info, CheckCircle, HelpCircle } from 'lucide-react';
import { useTheme } from './ThemeContext';

// Context para manejar los diálogos
const DialogContext = createContext();

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog debe usarse dentro de DialogProvider');
  }
  return context;
};

// Provider del sistema de diálogos
export const DialogProvider = ({ children }) => {
  const [dialogs, setDialogs] = useState([]);

  const showDialog = ({
    title,
    message,
    type = 'confirm',
    variant = 'info',
    confirmText = 'Aceptar',
    cancelText = 'Cancelar',
    onConfirm,
    onCancel,
  }) => {
    return new Promise((resolve) => {
      const id = Date.now();
      const dialog = {
        id,
        title,
        message,
        type,
        variant,
        confirmText,
        cancelText,
        onConfirm,
        onCancel,
        resolve,
      };
      
      setDialogs(prev => [...prev, dialog]);
    });
  };

  const closeDialog = (id, result) => {
    const dialog = dialogs.find(d => d.id === id);
    if (dialog?.resolve) {
      dialog.resolve(result);
    }
    if (result && dialog.onConfirm) {
      dialog.onConfirm(dialog.type === 'prompt' ? result : true);
    } else if (!result && dialog.onCancel) {
      dialog.onCancel();
    }
    setDialogs(prev => prev.filter(d => d.id !== id));
  };

  return (
    <DialogContext.Provider value={{ showDialog }}>
      {children}
      <DialogContainer dialogs={dialogs} onClose={closeDialog} />
    </DialogContext.Provider>
  );
};

// Componente individual de diálogo
const Dialog = ({ dialog, onClose, isDarkMode }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleClose = (result) => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(dialog.id, dialog.type === 'prompt' ? inputValue : result);
    }, 200);
  };

  const variants = {
    info: {
      icon: Info,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-500/10',
      accentColor: 'from-blue-500 to-blue-600',
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-yellow-500',
      iconBg: 'bg-yellow-500/10',
      accentColor: 'from-yellow-500 to-yellow-600',
    },
    error: {
      icon: AlertTriangle,
      iconColor: 'text-red-500',
      iconBg: 'bg-red-500/10',
      accentColor: 'from-red-500 to-red-600',
    },
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-500',
      iconBg: 'bg-green-500/10',
      accentColor: 'from-green-500 to-green-600',
    },
    question: {
      icon: HelpCircle,
      iconColor: 'text-purple-500',
      iconBg: 'bg-purple-500/10',
      accentColor: 'from-purple-500 to-purple-600',
    },
  };

  const variant = variants[dialog.variant] || variants.info;
  const Icon = variant.icon;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] ${
          isExiting ? 'animate-fadeOut' : 'animate-fadeIn'
        }`}
        onClick={() => dialog.type !== 'alert' && handleClose(false)}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
        <div
          className={`
            relative w-full max-w-md rounded-2xl shadow-2xl
            ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
            ${isExiting ? 'animate-scaleOut' : 'animate-scaleIn'}
          `}
        >
          {/* Accent bar */}
          <div className={`h-1.5 rounded-t-2xl bg-gradient-to-r ${variant.accentColor}`} />

          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`flex-shrink-0 p-3 rounded-xl ${variant.iconBg}`}>
                <Icon size={28} className={variant.iconColor} />
              </div>

              {/* Title & Close button */}
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-xl font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {dialog.title}
                </h3>
              </div>

              <button
                onClick={() => handleClose(false)}
                className={`
                  flex-shrink-0 p-1.5 rounded-lg transition-all duration-200
                  ${
                    isDarkMode
                      ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                      : 'hover:bg-black/5 text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            <p
              className={`text-base leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {dialog.message}
            </p>

            {/* Input para tipo prompt */}
            {dialog.type === 'prompt' && (
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoFocus
                className={`
                  mt-4 w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
                  }
                `}
                placeholder="Escribe aquí..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleClose(true);
                  }
                }}
              />
            )}
          </div>

          {/* Footer with buttons */}
          <div className="px-6 pb-6 flex gap-3 justify-end">
            {dialog.type !== 'alert' && (
              <button
                onClick={() => handleClose(false)}
                className={`
                  px-6 py-2.5 rounded-xl font-medium transition-all duration-200
                  ${
                    isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {dialog.cancelText}
              </button>
            )}
            
            <button
              onClick={() => handleClose(true)}
              className={`
                px-6 py-2.5 rounded-xl font-medium transition-all duration-200
                text-white bg-gradient-to-r ${variant.accentColor}
                hover:shadow-lg hover:scale-105 active:scale-95
              `}
            >
              {dialog.confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Contenedor de diálogos
const DialogContainer = ({ dialogs, onClose }) => {
  const { isDarkMode } = useTheme();

  return (
    <>
      {dialogs.map(dialog => (
        <Dialog
          key={dialog.id}
          dialog={dialog}
          onClose={onClose}
          isDarkMode={isDarkMode}
        />
      ))}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes scaleOut {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-fadeOut {
          animation: fadeOut 0.2s ease-in;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-scaleOut {
          animation: scaleOut 0.2s ease-in;
        }
      `}</style>
    </>
  );
};

export default function DialogDemo() {
  return (
    <DialogProvider>
      <DemoContent />
    </DialogProvider>
  );
}