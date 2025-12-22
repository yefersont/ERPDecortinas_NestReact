import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { User, Phone, MapPin, CreditCard, Save, X } from 'lucide-react';

const ClienteForm = ({ cliente = null, onSubmit, onCancel }) => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    cedula: cliente?.cedula || '',
    nombre: cliente?.nombre || '',
    apellidos: cliente?.apellidos || '',
    telefono: cliente?.telefono || '',
    direccion: cliente?.direccion || '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.cedula.trim()) {
      newErrors.cedula = 'La cédula es requerida';
    } else if (!/^\d+$/.test(formData.cedula)) {
      newErrors.cedula = 'La cédula debe contener solo números';
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son requeridos';
    } else if (formData.apellidos.trim().length < 2) {
      newErrors.apellidos = 'Los apellidos deben tener al menos 2 caracteres';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe tener 10 dígitos';
    }

    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
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
      cedula: Number(formData.cedula),
      nombre: formData.nombre.trim(),
      apellidos: formData.apellidos.trim(),
      telefono: formData.telefono.trim(),
      direccion: formData.direccion.trim(),
    };
    
    await onSubmit(dataToSubmit);
  } catch (error) {
    console.error('Error al guardar cliente:', error);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Cédula */}
      <div>
        <label
          htmlFor="cedula"
          className={`
            flex items-center gap-2 text-sm font-medium mb-2
            ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
          `}
        >
          <CreditCard size={16} />
          Cédula
          <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="cedula"
          name="cedula"
          value={formData.cedula}
          onChange={handleChange}
          placeholder="Ej: 1234567890"
          className={`
            w-full px-4 py-2.5 rounded-lg text-sm
            transition-all duration-200
            focus:outline-none focus:ring-2
            ${
              errors.cedula
                ? isDarkMode
                  ? 'bg-red-900/20 border-2 border-red-500 text-red-400'
                  : 'bg-red-50 border-2 border-red-500 text-red-900'
                : isDarkMode
                ? 'bg-gray-800 border border-gray-700 text-gray-200 focus:ring-blue-500/50 focus:border-blue-500'
                : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'
            }
          `}
        />
        {errors.cedula && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <span>⚠</span> {errors.cedula}
          </p>
        )}
      </div>

      {/* Nombre y Apellidos - Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div>
          <label
            htmlFor="nombre"
            className={`
              flex items-center gap-2 text-sm font-medium mb-2
              ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
            `}
          >
            <User size={16} />
            Nombre
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Luis"
            className={`
              w-full px-4 py-2.5 rounded-lg text-sm
              transition-all duration-200
              focus:outline-none focus:ring-2
              ${
                errors.nombre
                  ? isDarkMode
                    ? 'bg-red-900/20 border-2 border-red-500 text-red-400'
                    : 'bg-red-50 border-2 border-red-500 text-red-900'
                  : isDarkMode
                  ? 'bg-gray-800 border border-gray-700 text-gray-200 focus:ring-blue-500/50 focus:border-blue-500'
                  : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'
              }
            `}
          />
          {errors.nombre && (
            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
              <span>⚠</span> {errors.nombre}
            </p>
          )}
        </div>

        {/* Apellidos */}
        <div>
          <label
            htmlFor="apellidos"
            className={`
              flex items-center gap-2 text-sm font-medium mb-2
              ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
            `}
          >
            <User size={16} />
            Apellidos
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="apellidos"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            placeholder="Ej: González Herrera"
            className={`
              w-full px-4 py-2.5 rounded-lg text-sm
              transition-all duration-200
              focus:outline-none focus:ring-2
              ${
                errors.apellidos
                  ? isDarkMode
                    ? 'bg-red-900/20 border-2 border-red-500 text-red-400'
                    : 'bg-red-50 border-2 border-red-500 text-red-900'
                  : isDarkMode
                  ? 'bg-gray-800 border border-gray-700 text-gray-200 focus:ring-blue-500/50 focus:border-blue-500'
                  : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'
              }
            `}
          />
          {errors.apellidos && (
            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
              <span>⚠</span> {errors.apellidos}
            </p>
          )}
        </div>
      </div>

      {/* Teléfono */}
      <div>
        <label
          htmlFor="telefono"
          className={`
            flex items-center gap-2 text-sm font-medium mb-2
            ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
          `}
        >
          <Phone size={16} />
          Teléfono
          <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="telefono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="Ej: 3159876543"
          maxLength="10"
          className={`
            w-full px-4 py-2.5 rounded-lg text-sm
            transition-all duration-200
            focus:outline-none focus:ring-2
            ${
              errors.telefono
                ? isDarkMode
                  ? 'bg-red-900/20 border-2 border-red-500 text-red-400'
                  : 'bg-red-50 border-2 border-red-500 text-red-900'
                : isDarkMode
                ? 'bg-gray-800 border border-gray-700 text-gray-200 focus:ring-blue-500/50 focus:border-blue-500'
                : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'
            }
          `}
        />
        {errors.telefono && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <span>⚠</span> {errors.telefono}
          </p>
        )}
      </div>

      {/* Dirección */}
      <div>
        <label
          htmlFor="direccion"
          className={`
            flex items-center gap-2 text-sm font-medium mb-2
            ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
          `}
        >
          <MapPin size={16} />
          Dirección
          <span className="text-red-500">*</span>
        </label>
        <textarea
          id="direccion"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          placeholder="Ej: Av. Bolivar #100-50"
          rows="3"
          className={`
            w-full px-4 py-2.5 rounded-lg text-sm resize-none
            transition-all duration-200
            focus:outline-none focus:ring-2
            ${
              errors.direccion
                ? isDarkMode
                  ? 'bg-red-900/20 border-2 border-red-500 text-red-400'
                  : 'bg-red-50 border-2 border-red-500 text-red-900'
                : isDarkMode
                ? 'bg-gray-800 border border-gray-700 text-gray-200 focus:ring-blue-500/50 focus:border-blue-500'
                : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'
            }
          `}
        />
        {errors.direccion && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <span>⚠</span> {errors.direccion}
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

      {/* Botones */}
      <div className="flex gap-3 justify-end pt-2">
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
          type="submit"
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
              {cliente ? 'Actualizar' : 'Guardar'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ClienteForm;