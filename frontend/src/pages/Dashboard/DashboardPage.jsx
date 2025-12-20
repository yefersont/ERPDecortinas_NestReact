import React, { useEffect, useState } from "react";
import { 
    getEstadisticasResumen, 
    getEstadisticasVentasPorMes, 
    getEstadisticasProductosMasVendidos,
    getEstadisticasClientesConMayorDeuda,
    getEstadisticasClientesConMasCompras 
} from "../../api/DashboardApi";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  ShoppingCart,
  AlertCircle,
  Users,
  Package
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const DashboardPage = () => {
    const { isDarkMode } = useTheme();
    const [estadisticas, setEstadisticas] = useState(null);
    const [ventasPorMes, setVentasPorMes] = useState([]);
    const [productosMasVendidos, setProductosMasVendidos] = useState([]);
    const [clientesConMayorDeuda, setClientesConMayorDeuda] = useState([]);
    const [clientesConMasCompras, setClientesConMasCompras] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            
            const [resumenRes, ventasRes, productosRes, deudaRes, comprasRes] = await Promise.all([
                getEstadisticasResumen(),
                getEstadisticasVentasPorMes(),
                getEstadisticasProductosMasVendidos(),
                getEstadisticasClientesConMayorDeuda(),
                getEstadisticasClientesConMasCompras()
            ]);

            setEstadisticas(resumenRes.data || null);
            
            // Asegurar que sean arrays
            setVentasPorMes(Array.isArray(ventasRes.data.data) ? ventasRes.data.data : []);
            setProductosMasVendidos(Array.isArray(productosRes.data.data) ? productosRes.data.data : []);
            setClientesConMayorDeuda(Array.isArray(deudaRes.data.data) ? deudaRes.data.data : []);
            setClientesConMasCompras(Array.isArray(comprasRes.data.data) ? comprasRes.data.data : []);

            console.log('Datos cargados:', {
                estadisticas: resumenRes.data,
                ventasPorMes: ventasRes.data.data,
                productosMasVendidos: productosRes.data.data,
                clientesConMayorDeuda: deudaRes.data.data,
                clientesConMasCompras: comprasRes.data.data
            });
            
        } catch (error) {
            console.error("Error cargando estadísticas:", error);
            // Establecer valores por defecto en caso de error
            setEstadisticas(null);
            setVentasPorMes([]);
            setProductosMasVendidos([]);
            setClientesConMayorDeuda([]);
            setClientesConMasCompras([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value);
    };

    const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

    const StatCard = ({ icon: Icon, title, value, subtitle, trend, colorClass }) => (
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6 transition-all duration-300 hover:shadow-lg`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {title}
                    </p>
                    <h3 className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {value}
                    </h3>
                    {subtitle && (
                        <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {subtitle}
                        </p>
                    )}
                </div>
                <div className={`${colorClass} p-2 rounded-lg`}>
                    <Icon className="w-4 h-4 text-white" />
                </div>
            </div>
            {trend !== undefined && (
                <div className="flex items-center mt-4 text-sm">
                    {trend > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={trend > 0 ? 'text-green-500' : 'text-red-500'}>
                        {Math.abs(trend)}%
                    </span>
                    <span className={`ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        vs mes anterior
                    </span>
                </div>
            )}
        </div>
    );

    // Loading state
    if (loading) {
        return (
            <div className={`flex items-center justify-center h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Cargando estadísticas...</p>
                </div>
            </div>
        );
    }

    // Error state - si no hay datos
    if (!estadisticas) {
        return (
            <div className={`flex items-center justify-center h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Error al cargar los datos
                    </p>
                    <button 
                        onClick={cargarDatos}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Dashboard
                    </h1>
                    <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Resumen general
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={DollarSign}
                        title="Ingresos Totales"
                        value={formatCurrency(estadisticas.data.ingresosTotales || 0)}
                        trend={estadisticas.data.trend || 0}
                        colorClass="bg-gradient-to-br from-emerald-500 to-emerald-600"
                    />
                    <StatCard
                        icon={ShoppingCart}
                        title="Total Ventas"
                        value={estadisticas.data.totalVentas || 0}
                        subtitle="Ventas completadas"
                        colorClass="bg-gradient-to-br from-blue-500 to-blue-600"
                    />
                    <StatCard
                        icon={FileText}
                        title="Cotizaciones"
                        value={estadisticas.data.totalCotizaciones || 0}
                        subtitle={`${estadisticas.data.cotizacionesPendientes || 0} pendientes`}
                        colorClass="bg-gradient-to-br from-purple-500 to-purple-600"
                    />
                    <StatCard
                        icon={AlertCircle}
                        title="Deuda Total"
                        value={formatCurrency(estadisticas.data.deudaTotal || 0)}
                        trend={-5}
                        colorClass="bg-gradient-to-br from-rose-500 to-rose-600"
                    />
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Ventas por Mes */}
                    <div className="lg:col-span-2">
                        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6`}>
                            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Ventas por Mes
                            </h3>
                            {ventasPorMes.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={ventasPorMes}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                                        <XAxis 
                                            dataKey="mes" 
                                            stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                                            tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                                        />
                                        <YAxis 
                                            stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                                            tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                                            tickFormatter={(value) => `$${value / 1000}k`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                                                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                                                borderRadius: '8px',
                                                color: isDarkMode ? '#ffffff' : '#000000',
                                                fontSize: '12px'
                                            }}
                                            formatter={(value) => formatCurrency(value)}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="total" 
                                            stroke="#3b82f6" 
                                            strokeWidth={3}
                                            dot={{ fill: '#3b82f6', r: 5 }}
                                            activeDot={{ r: 7 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-[300px]">
                                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                        No hay datos de ventas disponibles
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Productos Más Vendidos */}
                    <div>
                        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6`}>
                            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Productos Más Vendidos
                            </h3>
                            {productosMasVendidos.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={productosMasVendidos}
                                            dataKey="vendidos"
                                            nameKey="producto"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            label={(entry) => entry.producto}
                                        >
                                            {productosMasVendidos.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                                                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                                                borderRadius: '8px'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-[300px]">
                                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                        No hay productos vendidos
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Clientes con Mayor Deuda */}
                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Clientes con Mayor Deuda
                            </h3>
                            <AlertCircle className={`w-5 h-5 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
                        </div>
                        {clientesConMayorDeuda.length > 0 ? (
                            <div className="space-y-4">
                                {clientesConMayorDeuda.map((cliente, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                                                index === 0 ? 'from-rose-500 to-rose-600' : 
                                                index === 1 ? 'from-orange-500 to-orange-600' : 
                                                'from-amber-500 to-amber-600'
                                            } flex items-center justify-center`}>
                                                <Users className="w-5 h-5 text-white" />
                                            </div>
                                            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {cliente.cliente}
                                            </span>
                                        </div>
                                        <span className={`font-semibold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                                            {formatCurrency(cliente.deuda)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-32">
                                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                    No hay deudores registrados
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Top Clientes por Compras */}
                    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border p-6`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Top Clientes por Compras
                            </h3>
                            <TrendingUp className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
                        </div>
                        {clientesConMasCompras.length > 0 ? (
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={clientesConMasCompras} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                                    <XAxis 
                                        type="number" 
                                        stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                                        tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 11 }}
                                        tickFormatter={(value) => `$${value / 1000}k`}
                                    />
                                    <YAxis 
                                        type="category" 
                                        dataKey="cliente" 
                                        stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                                        tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280', fontSize: 11 }}
                                        width={120}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                                            border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                                            borderRadius: '8px',
                                            fontSize: '12px'
                                        }}
                                        formatter={(value) => formatCurrency(value)}
                                    />
                                    <Bar dataKey="totalComprado" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[200px]">
                                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                    No hay datos de compras
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;   