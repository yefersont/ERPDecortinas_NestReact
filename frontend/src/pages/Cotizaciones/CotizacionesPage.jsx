
import React, { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import { useTheme } from "../../context/ThemeContext";
import { getCotizaciones, updateCotizacionWithDetails, deleteCotizacion } from "../../api/CotizacionesApi";
import { createVenta } from "../../api/VentasApi";
import TablaConPaginacion from "../../components/TablaConPaginacion";
import { FileText, Plus, Download, Upload, CheckCircle, Clock, XCircle, CircleDollarSign, Edit2, Trash2, Receipt } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { useDialog } from "../../context/DialogContext";
import Modal from "../../components/Modal";
import VentaForm from "../../components/VentaForm";
import CotizacionForm from "../../components/CotizacionForm";
import CotizacionDetalleVista from "../../components/CotizacionDetalleVista";

const CotizacionesPage = () => {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpenRegistrarVenta, setIsOpenRegistrarVenta] = useState(false);
  const [isOpenEditarCotizacion, setIsOpenEditarCotizacion] = useState(false);
  const [isOpenDetalles, setIsOpenDetalles] = useState(false);
  const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState(null);
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  const { showDialog } = useDialog();

  const getcotizaciones = async () => {
    try {
      const response = await getCotizaciones();
      setCotizaciones(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getcotizaciones();
  }, []);

  // Formatear fecha
  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Formatear moneda
  const formatMoneda = (valor) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(valor);
  };

  // Obtener badge de estado (si se vendió o no la cotización)
  const getEstadoBadge = (cotizacion) => {
    const tieneVenta = cotizacion.ventas && cotizacion.ventas.length > 0;
    
    if (!tieneVenta) {
      return (
        <span
          className={`
            inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
            ${
              isDarkMode
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-200 text-gray-700"
            }
          `}
        >
          <Clock size={12} />
          Sin Vender
        </span>
      );
    }

    // Si tiene venta, la cotización fue vendida
    return (
      <span
        className={`
          inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
          ${
            isDarkMode
              ? "bg-green-900/30 text-green-400"
              : "bg-green-100 text-green-700"
          }
        `}
      >
        <CheckCircle size={12} />
        Vendida
      </span>
    );
  };

  // Handler para eliminar cotización
  const handleDeleteCotizacion = async (cotizacion) => {
    try {
      showDialog({
        title: "Eliminar cotización",
        message: "¿Estás seguro de eliminar esta cotización? Esta acción no se puede deshacer",
        variant: "error",
        onConfirm: async () => {
          const response = await deleteCotizacion(cotizacion.id);
          console.log(response);
          showToast("Cotización eliminada exitosamente", "success");
          await getcotizaciones();
        },
        onCancel: () => {
          console.log("Cancelado");
        },
      });
    } catch (error) {
      console.error(error);
      showToast("Error al eliminar cotización", "error");
    }
  };

  // Handler para editar cotización
  const handleEditCotizacion = (row) => {
    const cotizacion = row.cotizacionCompleta;
    setCotizacionSeleccionada(cotizacion);
    setIsOpenEditarCotizacion(true);
  };

  const handleUpdateCotizacion = async (dataToSubmit) => {
    try {
      // Llamar a la API para actualizar la cotización con detalles
      const response = await updateCotizacionWithDetails(cotizacionSeleccionada.idCotizacion, dataToSubmit);
      console.log('Cotización actualizada:', response);
      showToast("Cotización actualizada exitosamente", "success");
      await getcotizaciones();
      setIsOpenEditarCotizacion(false);
      setCotizacionSeleccionada(null);
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || "Error al actualizar cotización", "error");
    }
  };

  // Handler para registrar como venta
  const handleRegistrarVenta = (cotizacion) => {
    setCotizacionSeleccionada(cotizacion.id);
    setIsOpenRegistrarVenta(true);
  };

  // Handler para ver detalles
  const handleVerDetalles = (cotizacion) => {
    setCotizacionSeleccionada(cotizacion.cotizacionCompleta);
    setIsOpenDetalles(true);
  };

  const handleSaveVenta = async (formData) => {
    try {
      // Combinar los datos del formulario con el idCotizacion
      const ventaData = {
        idCotizacion: cotizacionSeleccionada,
        ...formData
      };
      
      const response = await createVenta(ventaData);
      console.log(response);
      showToast("Venta registrada exitosamente", "success");
      await getcotizaciones();
      setIsOpenRegistrarVenta(false);
      setCotizacionSeleccionada(null);
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || "Error al registrar venta", "error");
    }
  };
  // Preparar datos para la tabla
  const tableData = cotizaciones.map((cotizacion) => ({
    id: cotizacion.idCotizacion,
    fecha: formatFecha(cotizacion.fecha),
    cliente: `${cotizacion.cliente.nombre} ${cotizacion.cliente.apellidos}`,
    valor: formatMoneda(cotizacion.valor_total),
    estado: getEstadoBadge(cotizacion),
    productos: cotizacion.detalles.length,
    cotizacionCompleta: cotizacion,
  }));

  const columns = [
    { 
      key: "fecha", 
      label: "Fecha",
      render: (row) => (
        <span>
          {row.fecha}
        </span>
      )
    },
    { 
      key: "cliente", 
      label: "Cliente",
      render: (row) => (
        <span>
          {row.cliente}
        </span>
      )
    },
    { 
      key: "valor", 
      label: "Valor Total",
      render: (row) => (
        <span>
          {row.valor}
        </span>
      )
    },
    { 
      key: "productos", 
      label: "Productos",
      render: (row) => (
        <span>
          {row.productos}
        </span>
      )
    },
    { 
      key: "estado", 
      label: "Estado",
      render: (row) => (
        <span 
          className="inline-block"
        >
          {row.estado}
        </span>
      )
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (row) => {
        const esVendida = row.cotizacionCompleta?.ventas && row.cotizacionCompleta.ventas.length > 0;
        
        return (
          <div className="flex items-center justify-center gap-2">
            {esVendida ? (
              <span
                className={`
                  text-xs font-medium px-3 py-1 rounded-lg
                  ${
                    isDarkMode
                      ? "text-gray-500 bg-gray-800"
                      : "text-gray-600 bg-gray-100"
                  }
                `}
              >
                Cotización vendida
              </span>
            ) : (
              <>
                {/* Botón Registrar Venta */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRegistrarVenta(row);
                  }}
                  className={`
                    p-2 rounded-lg transition-all duration-200
                    ${
                      isDarkMode
                        ? "hover:bg-green-600/20 text-green-400 hover:text-green-300"
                        : "hover:bg-green-50 text-green-600 hover:text-green-700"
                    }
                  `}
                  title="Registrar como venta"
                >
                  <Receipt size={18} />
                </button>
              
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditCotizacion(row);
                  }}
                  className={`
                    p-2 rounded-lg transition-all duration-200
                    ${
                      isDarkMode
                        ? "hover:bg-yellow-600/20 text-yellow-400 hover:text-yellow-300"
                        : "hover:bg-yellow-50 text-yellow-600 hover:text-yellow-700"
                    }
                  `}
                  title="Editar cotización"
                >
                  <Edit2 size={18} />
                </button>
              
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCotizacion(row.cotizacionCompleta);
                  }}
                  className={`
                    p-2 rounded-lg transition-all duration-200
                    ${
                      isDarkMode
                        ? "hover:bg-red-600/20 text-red-400 hover:text-red-300"
                        : "hover:bg-red-50 text-red-600 hover:text-red-700"
                    }
                  `}
                  title="Eliminar cotización"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </div>
        );
      }
    },
  ];

  // Calcular estadísticas
  const totalCotizaciones = cotizaciones.length;
  const cotizacionesPendientes = cotizaciones.filter(
    (c) => !c.ventas || c.ventas.length === 0
  ).length;
  const cotizacionesVendidas = cotizaciones.filter(
    (c) => c.ventas && c.ventas.length > 0
  ).length;
  const valorTotal = cotizaciones.reduce(
    (sum, c) => sum + parseFloat(c.valor_total),
    0
  );

  return loading ? (
    <Loader text="Cargando cotizaciones..." />
  ) : (
    <>
    <div
      className={`min-h-screen p-4 sm:p-6 lg:p-8 ${
        isDarkMode ? "bg-gray-950" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-6">
          {/* Título y Stats */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Icono decorativo */}
              <div
                className={`
                  hidden sm:flex items-center justify-center
                  w-14 h-14 rounded-2xl
                  ${
                    isDarkMode
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-600/30"
                      : "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30"
                  }
                `}
              >
                <FileText size={28} className="text-white" />
              </div>

              {/* Título y descripción */}
              <div>
                <h1
                  className={`
                    text-3xl lg:text-4xl font-bold tracking-tight
                    ${isDarkMode ? "text-white" : "text-gray-900"}
                  `}
                >
                  Cotizaciones
                </h1>
                <p
                  className={`
                    text-sm mt-1
                    ${isDarkMode ? "text-gray-400" : "text-gray-600"}
                  `}
                >
                  Gestiona tus {totalCotizaciones} cotizaciones registradas
                </p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl
                  text-sm font-medium transition-all duration-200
                  ${
                    isDarkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
                      : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm"
                  }
                `}
              >
                <Download size={16} />
                <span className="hidden sm:inline">Exportar</span>
              </button>

              <button
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl
                  text-sm font-medium transition-all duration-200
                  ${
                    isDarkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
                      : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm"
                  }
                `}
              >
                <Upload size={16} />
                <span className="hidden sm:inline">Importar</span>
              </button>

              <button
                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-xl
                  text-sm font-medium transition-all duration-200
                  ${
                    isDarkMode
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30"
                      : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  }
                `}
              >
                <Plus size={16} />
                Nueva Cotización
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 - Total */}
            <div
              className={`
                p-5 rounded-xl border
                ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-800"
                    : "bg-white border-gray-200"
                }
              `}
              style={{
                boxShadow: isDarkMode
                  ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                  : "0 4px 12px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`
                      text-xs font-medium uppercase tracking-wide
                      ${isDarkMode ? "text-gray-500" : "text-gray-600"}
                    `}
                  >
                    Total Cotizaciones
                  </p>
                  <p
                    className={`
                      text-2xl font-bold mt-1
                      ${isDarkMode ? "text-white" : "text-gray-900"}
                    `}
                  >
                    {totalCotizaciones}
                  </p>
                </div>
                <div
                  className={`
                    p-3 rounded-lg
                    ${isDarkMode ? "bg-blue-600/20" : "bg-blue-500/10"}
                  `}
                >
                  <FileText
                    size={20}
                    className={isDarkMode ? "text-blue-400" : "text-blue-600"}
                  />
                </div>
              </div>
            </div>

            {/* Card 2 - Pendientes */}
            <div
              className={`
                p-5 rounded-xl border
                ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-800"
                    : "bg-white border-gray-200"
                }
              `}
              style={{
                boxShadow: isDarkMode
                  ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                  : "0 4px 12px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`
                      text-xs font-medium uppercase tracking-wide
                      ${isDarkMode ? "text-gray-500" : "text-gray-600"}
                    `}
                  >
                    Pendientes
                  </p>
                  <p
                    className={`
                      text-2xl font-bold mt-1
                      ${isDarkMode ? "text-white" : "text-gray-900"}
                    `}
                  >
                    {cotizacionesPendientes}
                  </p>
                </div>
                <div
                  className={`
                    p-3 rounded-lg
                    ${isDarkMode ? "bg-yellow-600/20" : "bg-yellow-500/10"}
                  `}
                >
                  <Clock
                    size={20}
                    className={
                      isDarkMode ? "text-yellow-400" : "text-yellow-600"
                    }
                  />
                </div>
              </div>
            </div>

            {/* Card 3 - Vendidas */}
            <div
              className={`
                p-5 rounded-xl border
                ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-800"
                    : "bg-white border-gray-200"
                }
              `}
              style={{
                boxShadow: isDarkMode
                  ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                  : "0 4px 12px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`
                      text-xs font-medium uppercase tracking-wide
                      ${isDarkMode ? "text-gray-500" : "text-gray-600"}
                    `}
                  >
                    Convertidas
                  </p>
                  <p
                    className={`
                      text-2xl font-bold mt-1
                      ${isDarkMode ? "text-white" : "text-gray-900"}
                    `}
                  >
                    {cotizacionesVendidas}
                  </p>
                </div>
                <div
                  className={`
                    p-3 rounded-lg
                    ${isDarkMode ? "bg-green-600/20" : "bg-green-500/10"}
                  `}
                >
                  <CheckCircle
                    size={20}
                    className={isDarkMode ? "text-green-400" : "text-green-600"}
                  />
                </div>
              </div>
            </div>

            {/* Card 4 - Valor Total */}
            <div
              className={`
                p-5 rounded-xl border
                ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-800"
                    : "bg-white border-gray-200"
                }
              `}
              style={{
                boxShadow: isDarkMode
                  ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                  : "0 4px 12px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`
                      text-xs font-medium uppercase tracking-wide
                      ${isDarkMode ? "text-gray-500" : "text-gray-600"}
                    `}
                  >
                    Valor Total
                  </p>
                  <p
                    className={`
                      text-2xl font-bold mt-1
                      ${isDarkMode ? "text-white" : "text-gray-900"}
                    `}
                  >
                    {formatMoneda(valorTotal)}
                  </p>
                </div>
                <div
                  className={`
                    p-3 rounded-lg
                    ${isDarkMode ? "bg-purple-600/20" : "bg-purple-500/10"}
                  `}
                >
                  <span className="text-xl">                        <CircleDollarSign className={isDarkMode ? "text-purple-600" : "text-purple-600"} size={20} /></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <TablaConPaginacion
          columns={columns}
          data={tableData}
          pageSize={5}
          isDarkMode={isDarkMode}
          onRowClick={handleVerDetalles}
        />
      </div>
    </div>

    {/* Modal para registrar venta */}
    <Modal
      isOpen={isOpenRegistrarVenta}
      onClose={() => {
        setIsOpenRegistrarVenta(false);
        setCotizacionSeleccionada(null);
      }}
      title="Registrar Venta"
    >
    <VentaForm
      venta={cotizacionSeleccionada}
      onSubmit={handleSaveVenta}
      onCancel={() => {
        setIsOpenRegistrarVenta(false);
        setCotizacionSeleccionada(null);
      }}
      isDarkMode={isDarkMode}
    />
    </Modal>

    {/* Modal para editar cotización */}
    <Modal
      isOpen={isOpenEditarCotizacion}
      onClose={() => {
        setIsOpenEditarCotizacion(false);
        setCotizacionSeleccionada(null);
      }}
      title="Editar Cotización"
      size="xl"
    >
      {cotizacionSeleccionada && (
        <CotizacionForm
          cliente={cotizacionSeleccionada.cliente}
          cotizacion={cotizacionSeleccionada}
          onSubmit={handleUpdateCotizacion}
          onCancel={() => {
            setIsOpenEditarCotizacion(false);
            setCotizacionSeleccionada(null);
          }}
        />
      )}
    </Modal>

    {/* Modal para ver detalles */}
    <Modal
      isOpen={isOpenDetalles}
      onClose={() => {
        setIsOpenDetalles(false);
        setCotizacionSeleccionada(null);
      }}
      title="Detalles de la Cotización"
      size="full"
    >
      {cotizacionSeleccionada && (
        <CotizacionDetalleVista
          cotizacion={cotizacionSeleccionada}
          onClose={() => {
            setIsOpenDetalles(false);
            setCotizacionSeleccionada(null);
          }}
          isDarkMode={false}
        />
      )}
    </Modal>
    </>
  );
};

export default CotizacionesPage;
