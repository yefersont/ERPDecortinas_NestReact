import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, FileText, CreditCard, Package, ArrowUpDown, DollarSign } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getTipoProductos } from '../api/TipoProducto';

const CotizacionesForm = ({ cliente, onCancel, onSubmit }) => {

    const { isDarkMode } = useTheme();
    const [tiposProducto, setTiposProducto] = useState([]);
  
    const [formData, setFormData] = useState({
      cedulaCliente: '',
      fechaCotizacion: new Date().toISOString().split('T')[0],
      numeroProductos: 1,
      productos: [{
        alto: '',
        ancho: '',
        tipoProducto: '',
        valor: ''
      }]
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);


  const Productos = async () => {
    try {
      const response = await getTipoProductos();
      setTiposProducto(response.data.data);
    } catch (error) {
      console.error('Error al obtener tipos de productos:', error);
    }
  };

  useEffect(() => {
    Productos();
  }, []);

  const MAX_PRODUCTS = 7;

  const formatCurrency = (value) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(parseInt(numericValue));
  };

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

  const handleNumeroProductosChange = (e) => {
    let count = parseInt(e.target.value);
    if (isNaN(count) || count < 1) count = 1;
    if (count > MAX_PRODUCTS) count = MAX_PRODUCTS;
    
    const newProductos = Array(count).fill(null).map((_, index) => 
      formData.productos[index] || {
        alto: '',
        ancho: '',
        tipoProducto: '',
        valor: ''
      }
    );
    
    setFormData({ 
      ...formData, 
      numeroProductos: count,
      productos: newProductos 
    });
  };

  const handleProductoChange = (index, field, value) => {
    // Solo permitir números en alto y ancho
    if ((field === 'alto' || field === 'ancho') && value && !/^\d*\.?\d*$/.test(value)) {
      return;
    }
    
    const newProductos = [...formData.productos];
    newProductos[index] = { ...newProductos[index], [field]: value };
    setFormData({ ...formData, productos: newProductos });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fechaCotizacion) {
      newErrors.fechaCotizacion = 'La fecha es requerida';
    }

    formData.productos.forEach((p, index) => {
      if (!p.alto || !p.ancho || !p.tipoProducto || !p.valor) {
        newErrors[`producto_${index}`] = 'Complete todos los campos del producto';
      }
    });

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
        idCliente: cliente.idCliente,
        fecha: formData.fechaCotizacion,
        detalles: formData.productos.map(p => ({
          idTipo_producto: Number(p.tipoProducto),
          ancho: Number(p.ancho),
          alto: Number(p.alto),
          precio: Number(p.valor.replace(/[^0-9]/g, ''))
        }))
      };
      
      console.log('Cotización:', dataToSubmit);
      
      if (onSubmit) {
        await onSubmit(dataToSubmit);
      } else {
        alert('✅ Cotización registrada exitosamente!');
      }
    } catch (error) {
      console.error('Error al guardar cotización:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className={`w-full ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Body */}

        <div className="p-6">
          <div className="space-y-6">
            
            {/* Datos principales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
              {/* Fecha */}
              <div>
                <label
                  htmlFor="fechaCotizacion"
                  className={`
                    flex items-center gap-2 text-sm font-medium mb-2
                    ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  <Calendar size={16} />
                  Fecha de cotización
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="fechaCotizacion"
                  name="fechaCotizacion"
                  value={formData.fechaCotizacion}
                  onChange={handleChange}
                  className={`
                    w-full px-3 py-2 rounded-lg text-sm
                    transition-all duration-200
                    focus:outline-none focus:ring-2
                    ${
                      errors.fechaCotizacion
                        ? isDarkMode
                          ? 'bg-red-900/20 border-2 border-red-500 text-red-400'
                          : 'bg-red-50 border-2 border-red-500 text-red-900'
                        : isDarkMode
                        ? 'bg-gray-800 border border-gray-700 text-gray-200 focus:ring-blue-500/50 focus:border-blue-500'
                        : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'
                    }
                  `}
                />
                {errors.fechaCotizacion && (
                  <p className="mt-1 text-xs text-red-500">⚠ {errors.fechaCotizacion}</p>
                )}
              </div>


              {/* # Productos */}
              <div>
                <label
                  htmlFor="numeroProductos"
                  className={`
                    flex items-center gap-2 text-sm font-medium mb-2
                    ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
                  `}
                >
                  <Package size={16} />
                  #productos
                </label>
                <input
                  type="number"
                  id="numeroProductos"
                  name="numeroProductos"
                  value={formData.numeroProductos}
                  onChange={handleNumeroProductosChange}
                  min="1"
                  max={MAX_PRODUCTS}
                  className={`
                    w-full px-3 py-2 rounded-lg text-sm
                    transition-all duration-200
                    focus:outline-none focus:ring-2
                    ${
                      isDarkMode
                        ? 'bg-gray-800 border border-gray-700 text-gray-200 focus:ring-blue-500/50 focus:border-blue-500'
                        : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'
                    }
                  `}
                />
              </div>
            </div>

            {/* Productos */}
            <div className="space-y-3">
              {/* Primer producto */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <ArrowUpDown size={14} className="inline mr-1" />
                    Alto
                  </label>
                  <input
                    type="text"
                    value={formData.productos[0]?.alto || ''}
                    onChange={(e) => handleProductoChange(0, 'alto', e.target.value)}
                    placeholder="Ingrese alto..."
                    className={`
                      w-full px-3 py-2 rounded-lg text-sm
                      transition-all duration-200
                      focus:outline-none focus:ring-2
                      ${
                        isDarkMode
                          ? 'bg-gray-800 border border-gray-700 text-gray-200 focus:ring-blue-500/50 focus:border-blue-500'
                          : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'
                      }
                    `}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <ArrowUpDown size={14} className="inline mr-1 rotate-90" />
                    Ancho
                  </label>
                  <input
                    type="text"
                    value={formData.productos[0]?.ancho || ''}
                    onChange={(e) => handleProductoChange(0, 'ancho', e.target.value)}
                    placeholder="Ingrese ancho..."
                    className={`
                      w-full px-3 py-2 rounded-lg text-sm
                      transition-all duration-200
                      focus:outline-none focus:ring-2
                      ${
                        isDarkMode
                          ? 'bg-gray-800 border border-gray-700 text-gray-200 focus:ring-blue-500/50 focus:border-blue-500'
                          : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'
                      }
                    `}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Producto</label>
                  <select
                    value={formData.productos[0]?.tipoProducto || ''}
                    onChange={(e) => handleProductoChange(0, 'tipoProducto', e.target.value)}
                    className={`
                      w-full px-3 py-2 rounded-lg text-sm
                      transition-all duration-200
                      focus:outline-none focus:ring-2
                      ${
                        isDarkMode
                          ? 'bg-gray-800 border border-gray-700 text-gray-200 focus:ring-blue-500/50 focus:border-blue-500'
                          : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'
                      }
                    `}
                  >
                    <option value="">Seleccione una opción...</option>
                    {tiposProducto.map(tp => (
                      <option key={tp.idTipo_producto} value={tp.idTipo_producto}>{tp.nombre_tp}</option>
                    ))}
                  </select>
                </div>


                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Valor</label>
                  <input
                    type="text"
                    value={formData.productos[0]?.valor || ''}
                    onChange={(e) => {
                      const formatted = formatCurrency(e.target.value);
                      handleProductoChange(0, 'valor', formatted);
                    }}
                    placeholder="Ingrese valor..."
                    className={`
                      w-full px-3 py-2 rounded-lg text-sm
                      transition-all duration-200
                      focus:outline-none focus:ring-2
                      ${
                        isDarkMode
                          ? 'bg-gray-800 border border-gray-700 text-gray-200 focus:ring-blue-500/50 focus:border-blue-500'
                          : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'
                      }
                    `}
                  />
                </div>
              </div>

              {/* Productos adicionales */}
              {formData.productos.slice(1).map((producto, index) => (
                <div key={index + 1} className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div>
                    <input
                      type="text"
                      value={producto.alto}
                      onChange={(e) => handleProductoChange(index + 1, 'alto', e.target.value)}
                      placeholder="Ingrese alto..."
                      className={`
                        w-full px-3 py-2 rounded-lg text-sm
                        transition-all duration-200
                        focus:outline-none focus:ring-2
                        ${
                          isDarkMode
                            ? 'bg-gray-800 border border-gray-700 text-gray-200 focus:ring-blue-500/50 focus:border-blue-500'
                            : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'
                        }
                      `}
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={producto.ancho}
                      onChange={(e) => handleProductoChange(index + 1, 'ancho', e.target.value)}
                      placeholder="Ingrese ancho..."
                      className={`
                        w-full px-3 py-2 rounded-lg text-sm
                        transition-all duration-200
                        focus:outline-none focus:ring-2
                        ${
                          isDarkMode
                            ? 'bg-gray-800 border border-gray-700 text-gray-200 focus:ring-blue-500/50 focus:border-blue-500'
                            : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'
                        }
                      `}
                    />
                  </div>

                  <div>
                    <select
                      value={producto.tipoProducto}
                      onChange={(e) => handleProductoChange(index + 1, 'tipoProducto', e.target.value)}
                      className={`
                        w-full px-3 py-2 rounded-lg text-sm
                        transition-all duration-200
                        focus:outline-none focus:ring-2
                        ${
                          isDarkMode
                            ? 'bg-gray-800 border border-gray-700 text-gray-200 focus:ring-blue-500/50 focus:border-blue-500'
                            : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'
                        }
                      `}
                    >
                      <option value="">Seleccione...</option>
                      {tiposProducto.map(tp => (
                        <option key={tp.idTipo_producto} value={tp.idTipo_producto}>{tp.nombre_tp}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={producto.valor}
                      onChange={(e) => {
                        const formatted = formatCurrency(e.target.value);
                        handleProductoChange(index + 1, 'valor', formatted);
                      }}
                      placeholder="Ingrese valor..."
                      className={`
                        w-full px-3 py-2 rounded-lg text-sm
                        transition-all duration-200
                        focus:outline-none focus:ring-2
                        ${
                          isDarkMode
                            ? 'bg-gray-800 border border-gray-700 text-gray-200 focus:ring-blue-500/50 focus:border-blue-500'
                            : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500/50 focus:border-blue-500'
                        }
                      `}
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

{/* Footer */}
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
        Registrar
      </>
    )}
  </button>
</div>

      </div>
    </div>
  );
};

export default CotizacionesForm;