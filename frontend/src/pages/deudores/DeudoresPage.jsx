import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Loader from '../../components/Loader';
import { getDeudores } from '../../api/DeudoresApi';
import TablaConPaginacion from '../../components/TablaConPaginacion';
import { Wallet, Plus, Download, Upload, CheckCircle, Clock, TrendingUp, DollarSign } from 'lucide-react';

const DeudoresPage = () => {
    const { isDarkMode } = useTheme();
    const [deudores, setDeudores] = useState([]);
    const [loading, setLoading] = useState(true);

    const getdeudores = async () => {
        try {
            const response = await getDeudores();
            setDeudores(response.data.data);
        } catch (error) {
            console.error('Error fetching deudores:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getdeudores();
    }, []);

    // Formatear fecha
    const formatFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
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

    // Obtener badge de estado de pago
    const getEstadoPagoBadge = (estadoPago) => {
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

    // Preparar datos para la tabla
    const tableData = deudores.map((deudor) => {
        const clienteNombre = `${deudor.venta.cotizacion.cliente.nombre} ${deudor.venta.cotizacion.cliente.apellidos}`;
        
        return {
            id: deudor.idDeudor,
            fecha: formatFecha(deudor.fecha_abono),
            cliente: clienteNombre,
            venta: `#${deudor.idVenta}`,
            abono: formatMoneda(deudor.abono),
            totalVenta: formatMoneda(deudor.venta.total),
            saldoPendiente: formatMoneda(deudor.venta.saldo_pendiente),
            estado: getEstadoPagoBadge(deudor.venta.estado_pago),
        };
    });

    const columns = [
        { key: "fecha", label: "Fecha Abono" },
        { key: "cliente", label: "Cliente" },
        { key: "venta", label: "Venta" },
        { key: "abono", label: "Monto Abono" },
        { key: "totalVenta", label: "Total Venta" },
        { key: "saldoPendiente", label: "Saldo" },
        { key: "estado", label: "Estado" },
    ];

    // Calcular estadísticas
    const totalAbonos = deudores.length;
    const totalAbonosMonetarios = deudores.reduce(
        (sum, d) => sum + parseFloat(d.abono),
        0
    );

    // Ventas únicas
    const ventasUnicas = [...new Set(deudores.map((d) => d.idVenta))];
    const totalVentasConAbonos = ventasUnicas.length;

    // Ventas pagadas vs pendientes
    const ventasPagadas = deudores.filter(
        (d) => d.venta.estado_pago === "PAGADO"
    );
    const ventasPendientes = deudores.filter(
        (d) => d.venta.estado_pago === "PENDIENTE"
    );

    // Total pendiente de todas las ventas
    const totalSaldoPendiente = ventasUnicas.reduce((sum, ventaId) => {
        const deudor = deudores.find((d) => d.idVenta === ventaId);
        return sum + parseFloat(deudor.venta.saldo_pendiente);
    }, 0);

    return loading ? (
        <Loader text="Cargando abonos..." />
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
                                <Wallet size={28} className="text-white" />
                            </div>

                            {/* Título y descripción */}
                            <div>
                                <h1
                                    className={`
                                        text-3xl lg:text-4xl font-bold tracking-tight
                                        ${isDarkMode ? "text-white" : "text-gray-900"}
                                    `}
                                >
                                    Abonos
                                </h1>
                                <p
                                    className={`
                                        text-sm mt-1
                                        ${isDarkMode ? "text-gray-400" : "text-gray-600"}
                                    `}
                                >
                                    Gestiona tus {totalAbonos} abonos registrados
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
                                Registrar Abono
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Card 1 - Total Abonos */}
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
                                        Total Abonos
                                    </p>
                                    <p
                                        className={`
                                            text-2xl font-bold mt-1
                                            ${isDarkMode ? "text-white" : "text-gray-900"}
                                        `}
                                    >
                                        {totalAbonos}
                                    </p>
                                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                                        {totalVentasConAbonos} ventas con abonos
                                    </p>
                                </div>
                                <div
                                    className={`
                                        p-3 rounded-lg
                                        ${isDarkMode ? "bg-blue-600/20" : "bg-blue-500/10"}
                                    `}
                                >
                                    <Wallet
                                        size={20}
                                        className={isDarkMode ? "text-blue-400" : "text-blue-600"}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Card 2 - Total Recaudado */}
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
                                        Total Recaudado
                                    </p>
                                    <p
                                        className={`
                                            text-2xl font-bold mt-1
                                            ${isDarkMode ? "text-white" : "text-gray-900"}
                                        `}
                                    >
                                        {formatMoneda(totalAbonosMonetarios)}
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

                        {/* Card 3 - Ventas Saldadas */}
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
                                        Ventas Saldadas
                                    </p>
                                    <p
                                        className={`
                                            text-2xl font-bold mt-1
                                            ${isDarkMode ? "text-white" : "text-gray-900"}
                                        `}
                                    >
                                        {[...new Set(ventasPagadas.map(d => d.idVenta))].length}
                                    </p>
                                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                                        de {totalVentasConAbonos} ventas totales
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
                                        {formatMoneda(totalSaldoPendiente)}
                                    </p>
                                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                                        {[...new Set(ventasPendientes.map(d => d.idVenta))].length} ventas pendientes
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
                    pageSize={5}
                    isDarkMode={isDarkMode}
                />
            </div>
        </div>
    );
};

export default DeudoresPage;