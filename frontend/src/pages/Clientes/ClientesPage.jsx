import React, { useState, useEffect } from "react";
import { getClientes, createCliente, updateCliente, deleteCliente } from "../../api/ClientesApi";
import { createCotizacionWithDetails } from "../../api/CotizacionesApi";
import TablaConPaginacion from "../../components/TablaConPaginacion";
import { useTheme } from "../../context/ThemeContext";
import { Users, UserPlus, Download, Upload, Edit2, Trash2, SquarePen  } from "lucide-react";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import ClienteForm from "../../components/ClienteForm";
import CotizacionForm from "../../components/CotizacionForm";
import { useToast } from "../../context/ToastContext";
import {useDialog} from "../../context/DialogContext";

const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const { isDarkMode } = useTheme();
  const [isOpenNuevoCliente, setIsOpenNuevoCliente] = useState(false);
  const [isOpenCotizacion, setIsOpenCotizacion] = useState(false);
  const { showToast } = useToast();
  const { showDialog } = useDialog();
  
  const cargarClientes = async () => {
    try {
      setLoading(true);
      const response = await getClientes();
      setClientes(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false  );
    }
  };

  const handleSubmitCotizacion = async (cotizacion) => {
    try {
      const response = await createCotizacionWithDetails(cotizacion);
      console.log('Cotización creada:', response.data);
      showToast("Cotización creada exitosamente", "success");
      setIsOpenCotizacion(false);
      setClienteSeleccionado(null);
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || "Error al crear cotización", "error");
    }
  };
  const handleOpenNuevoCliente = () => {
    setIsOpenNuevoCliente(true);
  };

  const handleOpenNuevaCotizacion = (cliente) => {
    setIsOpenCotizacion(true);
    setClienteSeleccionado(cliente);
    console.log(cliente);
  };

  const handleDeleteCliente = async (cliente) => {
    try {

      showDialog({
        title: "Eliminar cliente",
        message: "¿Estás seguro de eliminar este cliente? Se perderan todos los datos asociados",
        onConfirm: async () => {
          const response = await deleteCliente(cliente.idCliente);
          console.log(response);
          showToast("Cliente eliminado exitosamente", "success");
          await cargarClientes();
        },
        onCancel: () => {
          console.log("Cancelado");
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setIsOpenNuevoCliente(false);
    setClienteSeleccionado(null);
  };

  const handleEditCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setIsOpenNuevoCliente(true);
  };

  const handleSubmit = async (formData) => {

    try{

      if (clienteSeleccionado){
        
        const response = await updateCliente(clienteSeleccionado.idCliente, formData);
        console.log(response);
        showToast("Cliente actualizado exitosamente", "success");
      }else{
        const response = await createCliente(formData);
        console.log(response);
        showToast("Cliente creado exitosamente", "success");
      }

      setIsOpenNuevoCliente(false);
      await cargarClientes();

    }catch(error){
      console.error(error);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

 const columns = [
  { key: "cedula", label: "Cédula" },
  { key: "nombre", label: "Nombre" },
  { key: "apellidos", label: "Apellidos" },
  { key: "telefono", label: "Teléfono" },
  { key: "direccion", label: "Dirección" },
  { 
    key: "acciones", 
    label: "Acciones",
    render: (row) => (
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => handleOpenNuevaCotizacion(row)}
          className={`
            p-2 rounded-lg transition-all duration-200
            ${
              isDarkMode
                ? "hover:bg-green-600/20 text-green-400 hover:text-green-300"
                : "hover:bg-green-50 text-green-600 hover:text-green-700"
            }
          `}
          title="Agregar cotizacion"
        >
          <SquarePen size={18} />
        </button>

        <button
          onClick={() => handleEditCliente(row)}
          className={`
            p-2 rounded-lg transition-all duration-200
            ${
              isDarkMode
                ? "hover:bg-yellow-600/20 text-yellow-400 hover:text-yellow-300"
                : "hover:bg-yellow-50 text-yellow-600 hover:text-yellow-700"
            }
          `}
          title="Editar cliente"
        >
          <Edit2 size={18} />
        </button>
        
        <button
          onClick={() => handleDeleteCliente(row)}
          className={`
            p-2 rounded-lg transition-all duration-200
            ${
              isDarkMode
                ? "hover:bg-red-600/20 text-red-400 hover:text-red-300"
                : "hover:bg-red-50 text-red-600 hover:text-red-700"
            }
          `}
          title="Eliminar cliente"
        >
          <Trash2 size={18} />
        </button>
      </div>
    )
  },
];

  return loading ? (
    <Loader text="Cargando clientes..." />
  ) : (
    <>
      <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${isDarkMode ? "bg-gray-950" : "bg-gray-50"}`}>
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
                  <Users size={28} className="text-white" />
                </div>

                {/* Título y descripción */}
                <div>
                  <h1
                    className={`
                      text-3xl lg:text-4xl font-bold tracking-tight
                      ${isDarkMode ? "text-white" : "text-gray-900"}
                    `}
                  >
                    Clientes
                  </h1>
                  <p
                    className={`
                      text-sm mt-1
                      ${isDarkMode ? "text-gray-400" : "text-gray-600"}
                    `}
                  >
                    {loading
                      ? "Cargando información..."
                      : `Gestiona tus ${clientes.length} clientes registrados`}
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
                  onClick={handleOpenNuevoCliente}
                  
                >
                  <UserPlus size={16} />
                  Nuevo Cliente
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1 */}
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
                      Total Clientes
                    </p>
                    <p
                      className={`
                        text-2xl font-bold mt-1
                        ${isDarkMode ? "text-white" : "text-gray-900"}
                      `}
                    >
                      {clientes.length}
                    </p>
                  </div>
                  <div
                    className={`
                      p-3 rounded-lg
                      ${isDarkMode ? "bg-blue-600/20" : "bg-blue-500/10"}
                    `}
                  >
                    <Users
                      size={20}
                      className={isDarkMode ? "text-blue-400" : "text-blue-600"}
                    />
                  </div>
                </div>
              </div>

              {/* Card 2 */}
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
                      Nuevos (mes)
                    </p>
                    <p
                      className={`
                        text-2xl font-bold mt-1
                        ${isDarkMode ? "text-white" : "text-gray-900"}
                      `}
                    >
                      24
                    </p>
                  </div>
                  <div
                    className={`
                      p-3 rounded-lg
                      ${isDarkMode ? "bg-green-600/20" : "bg-green-500/10"}
                    `}
                  >
                    <UserPlus
                      size={20}
                      className={isDarkMode ? "text-green-400" : "text-green-600"}
                    />
                  </div>
                </div>
              </div>

              {/* Card 3 */}
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
                      Activos
                    </p>
                    <p
                      className={`
                        text-2xl font-bold mt-1
                        ${isDarkMode ? "text-white" : "text-gray-900"}
                      `}
                    >
                      {Math.floor(clientes.length * 0.85)}
                    </p>
                  </div>
                  <div
                    className={`
                      p-3 rounded-lg
                      ${isDarkMode ? "bg-purple-600/20" : "bg-purple-500/10"}
                    `}
                  >
                    <div className="w-5 h-5 rounded-full bg-green-500" />
                  </div>
                </div>
              </div>

              {/* Card 4 */}
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
                      Crecimiento
                    </p>
                    <p
                      className={`
                        text-2xl font-bold mt-1
                        ${isDarkMode ? "text-white" : "text-gray-900"}
                      `}
                    >
                      +12%
                    </p>
                  </div>
                  <div
                    className={`
                      p-3 rounded-lg
                      ${isDarkMode ? "bg-orange-600/20" : "bg-orange-500/10"}
                    `}
                  >
                    <span className="text-xl">📈</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla */}
          {loading ? (
            <div
              className={`
                flex items-center justify-center py-20 rounded-2xl border
                ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-800"
                    : "bg-white border-gray-200"
                }
              `}
            >
              <div className="text-center space-y-3">
                <div
                  className={`
                    w-12 h-12 mx-auto rounded-full border-4 border-t-transparent
                    animate-spin
                    ${
                      isDarkMode
                        ? "border-blue-600"
                        : "border-blue-500"
                    }
                  `}
                />
                <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                  Cargando clientes...
                </p>
              </div>
            </div>
          ) : (
            <TablaConPaginacion
              columns={columns}
              data={clientes}
              pageSize={5}
              isDarkMode={isDarkMode}
            />
          )}
        </div>
      </div>
      {/* Modal para nuevo cliente */}


      <Modal
        isOpen={isOpenNuevoCliente}
        onClose={() => {
          setIsOpenNuevoCliente(false);
          setClienteSeleccionado(null);
        }}
        title={clienteSeleccionado ? "Editar Cliente" : "Nuevo Cliente"}
      >
        <ClienteForm
          cliente={clienteSeleccionado}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        /> 
      </Modal>

      {/* Modal para nueva cotizacion */}
      <Modal 
        isOpen={isOpenCotizacion} 
        onClose={() => setIsOpenCotizacion(false)} 
        title={"Nueva cotizacion " + clienteSeleccionado?.nombre + " " + clienteSeleccionado?.apellidos}
        size="xl"
      > 
        <CotizacionForm
          cliente={clienteSeleccionado}
          onSubmit={handleSubmitCotizacion}
          onCancel={() => setIsOpenCotizacion(false)}
        /> 
      </Modal>

    </>
  );
};

export default ClientesPage;