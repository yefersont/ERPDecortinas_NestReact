import React, { useState } from 'react';
import { Calendar, DollarSign, Save, X } from 'lucide-react';

const VentaForm = ({ venta = null, onSubmit, onCancel, isDarkMode = false }) => {
  const [formData, setFormData] = useState({
    fecha_venta: venta?.fecha_venta?.split('T')[0] || new Date().toISOString().split('T')[0],
    abono_inicial: venta?.abono_inicial ? formatCurrency(venta.abono_inicial.toString()) : '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function formatCurrency(value) {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(parseInt(numericValue));
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAbonoChange = (e) => {
    const formatted = formatCurrency(e.target.value);
    setFormData(prev => ({
      ...prev,
      abono_inicial: formatted
    }));
    if (errors.abono_inicial) {
      setErrors(prev => ({
        ...prev,
        abono_inicial: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fecha_venta) {
      newErrors.fecha_venta = 'La fecha de venta es requerida';
    }

    if (!formData.abono_inicial.trim()) {
      newErrors.abono_inicial = 'El abono inicial es requerido';
    } else {
      const valorNumerico = parseInt(formData.abono_inicial.replace(/[^0-9]/g, ''));
      if (valorNumerico <= 0) {
        newErrors.abono_inicial = 'El abono debe ser mayor a cero';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const dataToSubmit = {
        fecha_venta: `${formData.fecha_venta}T00:00:00.000Z`,
        abono_inicial: Number(formData.abono_inicial.replace(/[^0-9]/g, ''))
      };
      
      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error('Error al guardar venta:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className={`w-full ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="p-6">
          <div className="space-y-6">
            
            {/* Fecha y Hora - Grid */}
            <div className="grid grid-cols-1 gap-4">
              {/* Fecha de Venta */}
              <div>
                <label
                  htmlFor="fecha_venta"
                  className={`
                    flex items-center gap-2 text-sm font-medium mb-2
                    ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  <Calendar size={16} />
                  Fecha de Venta
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="fecha_venta"
                  name="fecha_venta"
                  value={formData.fecha_venta}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-2.5 rounded-lg text-sm
                    transition-all duration-200
                    focus:outline-none focus:ring-2
                    ${
                      errors.fecha_venta
                        ? isDarkMode
                          ? 'bg-red-900/20 border-2 border-red-500 text-red-400'
                          : 'bg-red-50 border-2 border-red-500 text-red-900'
                        : isDarkMode
                        ? 'bg-gray-800 border border-gray-700 text-gray-200 focus:ring-blue-500/50 focus:border-blue-500'
                        : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'
                    }
                  `}
                />
                {errors.fecha_venta && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.fecha_venta}
                  </p>
                )}
              </div>
            </div>

            {/* Abono Inicial */}
            <div>
              <label
                htmlFor="abono_inicial"
                className={`
                  flex items-center gap-2 text-sm font-medium mb-2
                  ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                <DollarSign size={16} />
                Abono Inicial
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="abono_inicial"
                name="abono_inicial"
                value={formData.abono_inicial}
                onChange={handleAbonoChange}
                placeholder="Ej: $ 300,000"
                className={`
                  w-full px-4 py-2.5 rounded-lg text-sm
                  transition-all duration-200
                  focus:outline-none focus:ring-2
                  ${
                    errors.abono_inicial
                      ? isDarkMode
                        ? 'bg-red-900/20 border-2 border-red-500 text-red-400'
                        : 'bg-red-50 border-2 border-red-500 text-red-900'
                      : isDarkMode
                      ? 'bg-gray-800 border border-gray-700 text-gray-200 focus:ring-blue-500/50 focus:border-blue-500'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'
                  }
                `}
              />
              {errors.abono_inicial && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <span>⚠</span> {errors.abono_inicial}
                </p>
              )}
            </div>

            {/* Nota informativa */}
            <div
              className={`
                p-4 rounded-lg border-l-4
                ${
                  isDarkMode
                    ? 'bg-blue-900/20 border-blue-500 text-blue-400'
                    : 'bg-blue-50 border-blue-500 text-blue-700'
                }
              `}
            >
              <p className="text-sm">
                <span className="font-semibold">Nota:</span> Los campos marcados con{' '}
                <span className="text-red-500">*</span> son obligatorios.
              </p>
            </div>

          </div>
        </div>

        {/* Footer con botones */}
        <div className={`border-t px-6 py-4 flex justify-end gap-3 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-lg
              text-sm font-medium transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-300'
              }
            `}
          >
            <X size={16} />
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-lg
              text-sm font-medium transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30'
              }
            `}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={16} />
                {venta ? 'Actualizar' : 'Guardar'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VentaForm;