import React, { useState } from 'react';
import { Calendar, DollarSign, Save, X, AlertCircle } from 'lucide-react';

const AbonoForm = ({ abono = null, venta = null, onSubmit, onCancel, isDarkMode = false, showToast }) => {
  const [formData, setFormData] = useState({
    abono: abono?.abono ? formatCurrency(abono.abono.toString()) : '',
    fecha_abono: abono?.fecha_abono?.split('T')[0] || new Date().toISOString().split('T')[0],
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
      abono: formatted
    }));
    if (errors.abono) {
      setErrors(prev => ({
        ...prev,
        abono: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fecha_abono) {
      newErrors.fecha_abono = 'La fecha de abono es requerida';
    }

    if (!formData.abono.trim()) {
      newErrors.abono = 'El abono es requerido';
    } else {
      const valorNumerico = parseInt(formData.abono.replace(/[^0-9]/g, ''));
      if (valorNumerico <= 0) {
        newErrors.abono = 'El abono debe ser mayor a cero';
      } else if (venta && valorNumerico > parseFloat(venta.saldo_pendiente)) {
        // Mostrar error con toast en lugar de mensaje inline
        if (showToast) {
          showToast(
            `El abono no puede ser mayor al saldo pendiente (${formatCurrency(venta.saldo_pendiente.toString())})`,
            'error'
          );
        }
        return false;
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
        abono: Number(formData.abono.replace(/[^0-9]/g, '')),
        fecha_abono: `${formData.fecha_abono}T18:00:00.000Z`
      };
      
      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error('Error al guardar abono:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className={`w-full ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="p-6">
          <div className="space-y-6">
            
            {/* Información de la venta */}
            {/* {venta && (
              <div
                className={`
                  p-4 rounded-lg border
                  ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-gray-50 border-gray-200'
                  }
                `}
              >
                <h3 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Información de la Venta
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Cliente</p>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {venta.cotizacion?.cliente?.nombre} {venta.cotizacion?.cliente?.apellidos}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Total Venta</p>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {formatCurrency(venta.total.toString())}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Saldo Pendiente</p>
                    <p className={`text-sm font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      {formatCurrency(venta.saldo_pendiente.toString())}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>Abonos Realizados</p>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {venta.abonos?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
            )} */}
            {/* Fecha y Abono - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fecha de Abono */}
              <div>
                <label
                  htmlFor="fecha_abono"
                  className={`
                    flex items-center gap-2 text-sm font-medium mb-2
                    ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  <Calendar size={16} />
                  Fecha de Abono
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="fecha_abono"
                  name="fecha_abono"
                  value={formData.fecha_abono}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-2.5 rounded-lg text-sm
                    transition-all duration-200
                    focus:outline-none focus:ring-2
                    ${
                      errors.fecha_abono
                        ? isDarkMode
                          ? 'bg-red-900/20 border-2 border-red-500 text-red-400'
                          : 'bg-red-50 border-2 border-red-500 text-red-900'
                        : isDarkMode
                        ? 'bg-gray-800 border border-gray-700 text-gray-200 focus:ring-blue-500/50 focus:border-blue-500'
                        : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'
                    }
                  `}
                />
                {errors.fecha_abono && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.fecha_abono}
                  </p>
                )}
              </div>

              {/* Abono */}
              <div>
                <label
                  htmlFor="abono"
                  className={`
                    flex items-center gap-2 text-sm font-medium mb-2
                    ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  <DollarSign size={16} />
                  Monto del Abono
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="abono"
                  name="abono"
                  value={formData.abono}
                  onChange={handleAbonoChange}
                  placeholder="Ej: $ 300,000"
                  className={`
                    w-full px-4 py-2.5 rounded-lg text-sm
                    transition-all duration-200
                    focus:outline-none focus:ring-2
                    ${
                      errors.abono
                        ? isDarkMode
                          ? 'bg-red-900/20 border-2 border-red-500 text-red-400'
                          : 'bg-red-50 border-2 border-red-500 text-red-900'
                        : isDarkMode
                        ? 'bg-gray-800 border border-gray-700 text-gray-200 focus:ring-blue-500/50 focus:border-blue-500'
                        : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'
                    }
                  `}
                />
                {errors.abono && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.abono}
                  </p>
                )}
              </div>
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
                {abono ? 'Actualizar' : 'Registrar'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AbonoForm;