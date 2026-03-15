import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Menu,
    X,
    Cloud,
    FileText,
    CreditCard,
    Users,
    AlertCircle,
    Moon,
    Sun,
    LayoutDashboard,
    ChevronRight,
    LogOut,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useDialog } from '../context/DialogContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const { isDarkMode, toggleDarkMode } = useTheme();
    const { user, logout } = useAuth();
    const { showDialog } = useDialog();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = async () => {
        const confirmed = await showDialog({
            title: 'Cerrar Sesión',
            message: '¿Estás seguro que deseas cerrar sesión?',
            type: 'confirm',
            variant: 'destructive',
            confirmText: 'Sí, cerrar sesión',
            cancelText: 'Cancelar'
        });

        if (confirmed) {
            logout();
        }
    };

    const navItems = [
        { to: '/dashboard', icon: LayoutDashboard , label: 'Estadisticas    ' },
        { to: '/cotizaciones', icon: FileText, label: 'Cotizaciones' },
        { to: '/ventas', icon: CreditCard, label: 'Ventas' },
        { to: '/clientes', icon: Users, label: 'Clientes' },
        { to: '/deudores', icon: AlertCircle, label: 'Deudores' },
    ];

    return (
        <aside 
            className={`
                ${isSidebarOpen ? 'w-72' : 'w-20'} 
                bg-black border-gray-800
                border-r
                transition-all duration-300 ease-in-out
                flex flex-col
                shadow-2xl
                relative
                h-screen
            `}
        >
                {/* Toggle Button — solo visible cuando está expandida */}
                {isSidebarOpen && (
                    <button
                        onClick={toggleSidebar}
                        className={`absolute -right-3 top-8 ${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-900/50' : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 shadow-gray-900/50'} text-white rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-10`}
                    >
                        <X size={16} />
                    </button>
                )}

                {/* Header */}
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        {/* Cuando está colapsada, el icono hamburguesa reemplaza al logo */}
                        {isSidebarOpen ? (
                            <div className={`${isDarkMode ? 'bg-gradient-to-br from-blue-600 to-blue-700' : 'bg-gradient-to-br from-gray-700 to-gray-800'} p-2.5 rounded-xl shadow-lg`}>
                                <Cloud size={24} className="text-white" />
                            </div>
                        ) : (
                            <button
                                onClick={toggleSidebar}
                                className={`${isDarkMode ? 'bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' : 'bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700'} p-2.5 rounded-xl shadow-lg transition-all duration-300 hover:scale-105`}
                            >
                                <Menu size={24} className="text-white" />
                            </button>
                        )}
                        {isSidebarOpen && (
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-lg">ERP Decortinas</span>
                                <span className="text-gray-400 text-xs">Sistema de gestión</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-6 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.to;
                        return (
                            <Link
                                key={item.label}
                                to={item.to}
                                className={`
                                    w-full flex items-center gap-3 px-4 py-3.5 rounded-xl
                                    transition-all duration-300
                                    ${isActive 
                                        ? isDarkMode 
                                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                                            : 'bg-white text-gray-900 shadow-md'
                                        : isDarkMode
                                            ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }
                                    ${!isSidebarOpen && 'justify-center'}
                                    group
                                `}
                            >
                                <item.icon 
                                    size={22} 
                                    className={`${isActive ? (isDarkMode ? 'text-white' : 'text-gray-900') : 'text-gray-400'} group-hover:scale-110 transition-transform duration-300`}
                                />
                                {isSidebarOpen && (
                                    <>
                                        <span className="font-medium flex-1 text-left">{item.label}</span>
                                        {isActive && <ChevronRight size={18} />}
                                    </>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className={`p-4 space-y-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-700'} border-t`}>
                    {/* Dark Mode Toggle */}
                    <div className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl
                        bg-zinc-900 border border-zinc-800
                        ${!isSidebarOpen && 'justify-center'}
                    `}>
                        <div className="flex items-center gap-3 flex-1">
                            {isDarkMode ? (
                                <Moon size={20} className="text-blue-400" />
                            ) : (
                                <Sun size={20} className="text-gray-400" />
                            )}
                            {isSidebarOpen && (
                                <span className="text-gray-300 text-sm font-medium">
                                    {isDarkMode ? 'Modo oscuro' : 'Modo claro'}
                                </span>
                            )}
                        </div>
                        {isSidebarOpen && (
                            <button
                                onClick={toggleDarkMode}
                                className={`
                                    w-12 h-6 rounded-full transition-all duration-300
                                    ${isDarkMode ? 'bg-blue-600' : 'bg-gray-600'}
                                    relative
                                `}
                            >
                                <div className={`
                                    w-5 h-5 bg-white rounded-full shadow-lg
                                    absolute top-0.5 transition-all duration-300
                                    ${isDarkMode ? 'left-6' : 'left-0.5'}
                                `} />
                            </button>
                        )}
                    </div>

                    {/* User Profile */}
                    {isSidebarOpen && (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 transition-all duration-300 group">
                            <div className="relative">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border-2 ${isDarkMode ? 'bg-blue-900 text-blue-100 border-gray-600' : 'bg-gray-700 text-gray-100 border-gray-600'} transition-all duration-300`}>
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-800"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium text-sm truncate">{user?.name || 'Usuario'}</p>
                                <p className="text-gray-400 text-xs truncate">{user?.email || 'correo@ejemplo.com'}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-1.5 rounded-lg transition-colors text-gray-400 hover:text-red-400 hover:bg-red-400/10"
                                title="Cerrar Sesión"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    )}

                    {!isSidebarOpen && (
                        <div className="flex flex-col items-center gap-2">
                            <div className="relative">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border-2 ${isDarkMode ? 'bg-blue-900 text-blue-100 border-gray-600 hover:border-blue-500' : 'bg-gray-700 text-gray-100 border-gray-600 hover:border-gray-500'} transition-all duration-300 cursor-pointer`}>
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-800"></div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-1.5 rounded-lg transition-colors text-gray-400 hover:text-red-400 hover:bg-red-400/10"
                                title="Cerrar Sesión"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </aside>
    );
};

export default Navbar;