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
      <div className="max-w-5xl mx-auto px-4 py-4">

        <div
          className={`rounded-2xl border overflow-hidden
        ${isDarkMode
              ? 'bg-gray-900 border-gray-800'
              : 'bg-white border-gray-200'
            }`}
        >

          {/* Header */}
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Cliente
                </p>

                <h1
                  className={`mt-1 text-2xl font-semibold
                ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  {cotizacion?.cliente?.nombre ?? ''}{' '}
                  {cotizacion?.cliente?.apellidos ?? ''}
                </h1>
              </div>

              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Fecha
                </p>

                <p
                  className={`mt-1 text-sm
                ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  {formatDate(cotizacion?.fecha)}
                </p>
              </div>
            </div>
          </div>

          {/* Separador */}
          <div
            className={`border-t
          ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}
          />

          {/* Productos */}
          <div className="p-6">
            <h3
              className={`text-sm font-semibold mb-4
            ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Productos
            </h3>

            <div
              className={`grid grid-cols-12 gap-4 pb-3 text-xs uppercase tracking-wider
            ${isDarkMode
                  ? 'text-gray-400'
                  : 'text-gray-500'
                }`}
            >
              <div className="col-span-5">Producto</div>
              <div className="col-span-3">Medidas</div>
              <div className="col-span-2">Área</div>
              <div className="col-span-2 text-right">Precio</div>
            </div>

            {cotizacion?.detalles?.map((d, i) => (
              <div
                key={d.idDetalle || i}
                className={`grid grid-cols-12 gap-4 py-4
              ${isDarkMode
                    ? 'border-t border-gray-800'
                    : 'border-t border-gray-100'
                  }`}
              >
                <div
                  className={`col-span-5 font-medium
                ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  {d?.tipoProducto?.nombre_tp}
                </div>

                <div
                  className={`col-span-3
                ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  {d?.ancho} Ancho × {d?.alto} Alto
                </div>

                <div
                  className={`col-span-2
                ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                >
                  {(Number(d?.ancho) * Number(d?.alto) || 0).toFixed(2)} m²
                </div>

                <div
                  className={`col-span-2 text-right font-semibold
                ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  {formatCurrency(d?.precio)}
                </div>
              </div>
            ))}
          </div>

          {/* Estado */}
          {venta && (
            <>
              <div
                className={`border-t
              ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}
              />

              <div className="p-6 flex justify-between items-center">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Estado de Pago
                  </p>

                  <span
                    className={`inline-flex mt-2 px-3 py-1 rounded-full text-xs font-medium
                  ${isPagado
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                      }`}
                  >
                    {isPagado ? 'Pagado' : 'Pendiente'}
                  </span>
                </div>

                {!isPagado && (
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      Saldo pendiente
                    </p>

                    <p
                      className={`text-xl font-semibold mt-1
                    ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                      {formatCurrency(venta?.saldo_pendiente)}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Total */}
          <div
            className={`border-t px-6 py-5 flex justify-between items-center
          ${isDarkMode
                ? 'border-gray-800 bg-gray-800/40'
                : 'border-gray-200 bg-gray-50'
              }`}
          >
            <span
              className={`font-semibold
            ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            >
              Total General
            </span>

            <span className="text-3xl font-bold">
              {formatCurrency(cotizacion?.valor_total)}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CotizacionDetalleView;
