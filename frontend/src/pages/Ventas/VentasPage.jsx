import React, { useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import { getVentas } from '../../api/VentasApi';
import TablaConPaginacion from '../../components/TablaConPaginacion';
import { useTheme } from '../../context/ThemeContext';
import { CreditCard, Plus, Download, Upload, CheckCircle, Clock, DollarSign, TrendingUp } from 'lucide-react';

const VentasPage = () => {
    const [loading, setLoading] = useState(true);
    const [ventas, setVentas] = useState([]);
    const { isDarkMode } = useTheme();

    const cargarVentas = async () => {
        try {
            const response = await getVentas();
            setVentas(response.data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarVentas();
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

    // Obtener badge de estado
    const getEstadoBadge = (estadoPago) => {
        if (estadoPago === "PAGADO") {
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
                    Pagado
                </span>
            );
        }

        return (
            <span
                className={`
                    inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                    ${
                        isDarkMode
                            ? "bg-yellow-900/30 text-yellow-400"
                            : "bg-yellow-100 text-yellow-700"
                    }
                `}
            >
                <Clock size={12} />
                Pendiente
            </span>
        );
    };

    // Calcular porcentaje pagado
    const calcularPorcentajePagado = (total, saldoPendiente) => {
        const pagado = parseFloat(total) - parseFloat(saldoPendiente);
        const porcentaje = (pagado / parseFloat(total)) * 100;
        return Math.round(porcentaje);
    };

    // Preparar datos para la tabla
    const tableData = ventas.map((venta) => {
        const porcentajePagado = calcularPorcentajePagado(venta.total, venta.saldo_pendiente);
        
        return {
            id: venta.idVenta,
            fecha: formatFecha(venta.fecha_venta),
            cotizacion: `#${venta.idCotizacion}`,
            total: formatMoneda(venta.total),
            pagado: formatMoneda(parseFloat(venta.total) - parseFloat(venta.saldo_pendiente)),
            saldo: formatMoneda(venta.saldo_pendiente),
            progreso: (
                <div className="flex items-center gap-2">
                    <div className={`flex-1 h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div
                            className={`h-full transition-all duration-300 ${
                                porcentajePagado === 100
                                    ? 'bg-green-500'
                                    : 'bg-blue-500'
                            }`}
                            style={{ width: `${porcentajePagado}%` }}
                        />
                    </div>
                    <span className={`text-xs font-medium min-w-[40px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {porcentajePagado}%
                    </span>
                </div>
            ),
            estado: getEstadoBadge(venta.estado_pago),
            abonos: venta.abonos.length,
        };
    });

    const columns = [
        { key: "id", label: "ID" },
        { key: "fecha", label: "Fecha" },
        { key: "cotizacion", label: "Cotización" },
        { key: "total", label: "Total" },
        { key: "pagado", label: "Pagado" },
        { key: "saldo", label: "Saldo" },
        { key: "progreso", label: "Progreso" },
        { key: "abonos", label: "Abonos" },
        { key: "estado", label: "Estado" },
    ];

    // Calcular estadísticas
    const totalVentas = ventas.length;
    const ventasPendientes = ventas.filter((v) => v.estado_pago === "PENDIENTE").length;
    const ventasPagadas = ventas.filter((v) => v.estado_pago === "PAGADO").length;
    const totalIngresos = ventas.reduce((sum, v) => sum + parseFloat(v.total), 0);
    const totalPagado = ventas.reduce(
        (sum, v) => sum + (parseFloat(v.total) - parseFloat(v.saldo_pendiente)),
        0
    );
    const totalPendiente = ventas.reduce((sum, v) => sum + parseFloat(v.saldo_pendiente), 0);
    const totalAbonos = ventas.reduce((sum, v) => sum + v.abonos.length, 0);

    return loading ? (
        <Loader text="Cargando ventas..." />
    ) : (
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
                                <CreditCard size={28} className="text-white" />
                            </div>

                            {/* Título y descripción */}
                            <div>
                                <h1
                                    className={`
                                        text-3xl lg:text-4xl font-bold tracking-tight
                                        ${isDarkMode ? "text-white" : "text-gray-900"}
                                    `}
                                >
                                    Ventas
                                </h1>
                                <p
                                    className={`
                                        text-sm mt-1
                                        ${isDarkMode ? "text-gray-400" : "text-gray-600"}
                                    `}
                                >
                                    Gestiona tus {totalVentas} ventas registradas
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
                                Nueva Venta
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Card 1 - Total Ventas */}
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
                                        Total Ventas
                                    </p>
                                    <p
                                        className={`
                                            text-2xl font-bold mt-1
                                            ${isDarkMode ? "text-white" : "text-gray-900"}
                                        `}
                                    >
                                        {totalVentas}
                                    </p>
                                </div>
                                <div
                                    className={`
                                        p-3 rounded-lg
                                        ${isDarkMode ? "bg-blue-600/20" : "bg-blue-500/10"}
                                    `}
                                >
                                    <CreditCard
                                        size={20}
                                        className={isDarkMode ? "text-blue-400" : "text-blue-600"}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Card 2 - Ingresos Totales */}
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
                                        Ingresos Totales
                                    </p>
                                    <p
                                        className={`
                                            text-2xl font-bold mt-1
                                            ${isDarkMode ? "text-white" : "text-gray-900"}
                                        `}
                                    >
                                        {formatMoneda(totalIngresos)}
                                    </p>
                                </div>
                                <div
                                    className={`
                                        p-3 rounded-lg
                                        ${isDarkMode ? "bg-green-600/20" : "bg-green-500/10"}
                                    `}
                                >
                                    <DollarSign
                                        size={20}
                                        className={isDarkMode ? "text-green-400" : "text-green-600"}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Card 3 - Total Pagado */}
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
                                        Total Pagado
                                    </p>
                                    <p
                                        className={`
                                            text-2xl font-bold mt-1
                                            ${isDarkMode ? "text-white" : "text-gray-900"}
                                        `}
                                    >
                                        {formatMoneda(totalPagado)}
                                    </p>
                                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                                        {totalAbonos} abonos realizados
                                    </p>
                                </div>
                                <div
                                    className={`
                                        p-3 rounded-lg
                                        ${isDarkMode ? "bg-purple-600/20" : "bg-purple-500/10"}
                                    `}
                                >
                                    <CheckCircle
                                        size={20}
                                        className={isDarkMode ? "text-purple-400" : "text-purple-600"}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Card 4 - Saldo Pendiente */}
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
                                        Saldo Pendiente
                                    </p>
                                    <p
                                        className={`
                                            text-2xl font-bold mt-1
                                            ${isDarkMode ? "text-white" : "text-gray-900"}
                                        `}
                                    >
                                        {formatMoneda(totalPendiente)}
                                    </p>
                                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                                        {ventasPendientes} ventas pendientes
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
                                        className={isDarkMode ? "text-yellow-400" : "text-yellow-600"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabla */}
                <TablaConPaginacion
                    columns={columns}
                    data={tableData}
                    pageSize={10}
                    isDarkMode={isDarkMode}
                />
            </div>
        </div>
    );
};

export default VentasPage;