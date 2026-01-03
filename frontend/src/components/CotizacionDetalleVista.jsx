import React from 'react';
import { User, CheckCircle, Clock } from 'lucide-react';

const CotizacionDetalleView = ({ cotizacion, isDarkMode = false }) => {

  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(Number(value || 0));

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString('es-CO', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      : '—';

  const venta = cotizacion?.ventas?.[0] || null;
  const isPagado = venta?.estado_pago === 'PAGADO';

  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto px-4 py-2 space-y-4">

        {/* Cliente */}
        <div className={`rounded-2xl p-5 shadow border
          ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          
          <div className="flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center
              ${isDarkMode ? 'bg-blue-600/30' : 'bg-blue-100'}`}>
              <User className="text-blue-600" size={22} />
            </div>

            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Cliente
              </p>
              <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {cotizacion?.cliente?.nombre ?? ''} {cotizacion?.cliente?.apellidos ?? ''}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Fecha
              </p>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {formatDate(cotizacion?.fecha)}
              </p>
            </div>
          </div>
        </div>

        {/* Productos */}
        <div className={`rounded-2xl p-5 shadow border
          ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>

          <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
            Detalle de productos
          </p>

          <div className="space-y-2">
            {cotizacion?.detalles?.map((d, i) => (
              <div key={d.idDetalle || i}
                className={`flex items-center gap-4 p-3 rounded-xl
                ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 font-bold flex items-center justify-center">
                  {i + 1}
                </div>

                <div className="flex-1">
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {d?.tipoProducto?.nombre_tp ?? 'Producto'}
                  </p>

                  <p className="text-xs text-gray-500">
                    {d?.ancho} × {d?.alto} m — {(Number(d?.ancho) * Number(d?.alto) || 0).toFixed(2)} m²
                  </p>
                </div>

                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(d?.precio)}
                </p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between">
            <span className="font-bold text-gray-700">Total General</span>
            <span className="text-2xl font-bold text-blue-600">
              {formatCurrency(cotizacion?.valor_total)}
            </span>
          </div>
        </div>

        {/* Estado de Venta */}
        {venta && (
          <div className={`rounded-2xl p-5 shadow border
            ${isPagado
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-amber-50 border-amber-200'
            }`}>

            <div className="flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center
                ${isPagado ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                {isPagado ? <CheckCircle className="text-white" /> : <Clock className="text-white" />}
              </div>

              <div className="flex-1">
                <p className="text-xs font-semibold uppercase text-gray-600">
                  Estado de Pago
                </p>

                <p className={`text-lg font-bold
                  ${isPagado ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {isPagado ? 'Pago Completado' : 'Pago Pendiente'}
                </p>

                <p className="text-xs text-gray-500">
                  {formatDate(venta?.fecha_venta)}
                </p>
              </div>

              {!isPagado && (
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase text-amber-600">
                    Saldo pendiente
                  </p>
                  <p className="text-xl font-bold text-amber-700">
                    {formatCurrency(venta?.saldo_pendiente)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CotizacionDetalleView;
