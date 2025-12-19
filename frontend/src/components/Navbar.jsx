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
    ChevronRight
} from 'lucide-react';

// IMPORTAR EL CONTEXT REAL - Cambia la ruta según tu estructura
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const { isDarkMode, toggleDarkMode } = useTheme(); // Usar el context

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const navItems = [
        { to: '/cotizaciones', icon: FileText, label: 'Cotizaciones' },
        { to: '/ventas', icon: CreditCard, label: 'Ventas' },
        { to: '/clientes', icon: Users, label: 'Clientes' },
        { to: '/deudores', icon: AlertCircle, label: 'Deudores' },
    ];

    return (
        <aside 
            className={`
                ${isSidebarOpen ? 'w-72' : 'w-20'} 
                ${isDarkMode ? 'bg-gradient-to-b from-slate-900 to-slate-800 border-slate-700/50' : 'bg-gradient-to-b from-white to-gray-50 border-gray-300'}
                border-r
                transition-all duration-300 ease-in-out
                flex flex-col
                shadow-2xl
                relative
                h-screen
            `}
        >
                {/* Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className={`absolute -right-3 top-8 ${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-blue-500/50' : 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-blue-400/50'} text-white rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-10`}
                >
                    {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
                </button>

                {/* Header */}
                <div className={`p-6 ${isDarkMode ? 'border-slate-700/50' : 'border-gray-200'} border-b`}>
                    <div className="flex items-center gap-3">
                        <div className={`${isDarkMode ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-blue-400 to-indigo-500'} p-2.5 rounded-xl shadow-lg`}>
                            <Cloud size={24} className="text-white" />
                        </div>
                        {isSidebarOpen && (
                            <div className="flex flex-col">
                                <span className={`${isDarkMode ? 'text-white' : 'text-gray-800'} font-bold text-lg`}>ERP Decortinas</span>
                                <span className={`${isDarkMode ? 'text-slate-400' : 'text-gray-500'} text-xs`}>Sistema de gestión</span>
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
                                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                                            : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-400/30'
                                        : isDarkMode
                                            ? 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                            : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                    }
                                    ${!isSidebarOpen && 'justify-center'}
                                    group
                                `}
                            >
                                <item.icon 
                                    size={22} 
                                    className={`${isActive ? 'text-white' : isDarkMode ? 'text-slate-400' : 'text-gray-500'} group-hover:scale-110 transition-transform duration-300`}
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
                <div className={`p-4 space-y-4 ${isDarkMode ? 'border-slate-700/50' : 'border-gray-200'} border-t`}>
                    {/* Dark Mode Toggle */}
                    <div className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl
                        ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-gray-100 border-gray-300'}
                        border
                        ${!isSidebarOpen && 'justify-center'}
                    `}>
                        <div className="flex items-center gap-3 flex-1">
                            {isDarkMode ? (
                                <Moon size={20} className="text-blue-400" />
                            ) : (
                                <Sun size={20} className="text-amber-500" />
                            )}
                            {isSidebarOpen && (
                                <span className={`${isDarkMode ? 'text-slate-300' : 'text-gray-700'} text-sm font-medium`}>
                                    {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                                </span>
                            )}
                        </div>
                        {isSidebarOpen && (
                            <button
                                onClick={toggleDarkMode}
                                className={`
                                    w-12 h-6 rounded-full transition-all duration-300
                                    ${isDarkMode ? 'bg-blue-600' : 'bg-gray-400'}
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
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600/50 hover:border-blue-500/50' : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300 hover:border-blue-400'} border transition-all duration-300 cursor-pointer group`}>
                            <div className="relative">
                                <img 
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" 
                                    alt="User" 
                                    className={`w-10 h-10 rounded-full border-2 ${isDarkMode ? 'border-blue-500/50 group-hover:border-blue-500' : 'border-blue-400/50 group-hover:border-blue-400'} transition-all duration-300`}
                                />
                                <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 ${isDarkMode ? 'border-slate-800' : 'border-white'}`}></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`${isDarkMode ? 'text-white' : 'text-gray-800'} font-medium text-sm truncate`}>Yeferson Tello</p>
                                <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-500'} text-xs truncate`}>ytello37@misena.edu.co</p>
                            </div>
                            <ChevronRight size={18} className={`${isDarkMode ? 'text-slate-400 group-hover:text-blue-400' : 'text-gray-400 group-hover:text-blue-500'} transition-colors`} />
                        </div>
                    )}

                    {!isSidebarOpen && (
                        <div className="flex justify-center">
                            <div className="relative">
                                <img 
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" 
                                    alt="User" 
                                    className={`w-10 h-10 rounded-full border-2 ${isDarkMode ? 'border-blue-500/50 hover:border-blue-500' : 'border-blue-400/50 hover:border-blue-400'} transition-all duration-300 cursor-pointer`}
                                />
                                <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 ${isDarkMode ? 'border-slate-800' : 'border-white'}`}></div>
                            </div>
                        </div>
                    )}
                </div>
            </aside>
    );
};

export default Navbar;