import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    FileText,
    CreditCard,
    Users,
    AlertCircle,
    Moon,
    Sun,
    LayoutDashboard,
    LogOut,
    Bell,
    ChevronRight,
    ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDialog } from '../context/DialogContext';
import { useTheme } from '../context/ThemeContext';
import { getNotificacionesDeudores } from '../api/Notificaciones.js';

const Navbar = () => {
    const location = useLocation();
    const { isDarkMode, toggleDarkMode } = useTheme();
    const { user, logout } = useAuth();
    const { showDialog } = useDialog();
    const [notificaciones, setNotificaciones] = useState([]);
    const [openNotifications, setOpenNotifications] = useState(false);

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

    const getNotificaciones = async () => {
        try {
            const response = await getNotificacionesDeudores();
            setNotificaciones(response.data.data);
        } catch (error) {
            console.error('Error al obtener notificaciones:', error);
        }
    }

    const navItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Estadisticas' },
        { to: '/cotizaciones', icon: FileText, label: 'Cotizaciones' },
        { to: '/ventas', icon: CreditCard, label: 'Ventas' },
        { to: '/clientes', icon: Users, label: 'Clientes' },
        { to: '/deudores', icon: AlertCircle, label: 'Deudores' },
    ];

    useEffect(() => {
        getNotificaciones();
    }, []);

    return (
        <aside
            className="
                w-72
                bg-black border-gray-800
                border-r
                flex flex-col
                shadow-2xl
                h-screen
            "
        >
            {/* Header — Logo */}
            <div className="p-6 border-b border-gray-800">
                <div className="flex items-center justify-center">
                    <img
                        src="src/assets/images/decortinas.jpg"
                        alt="Decortinas Logo"
                        className="h-16 w-auto object-contain rounded-xl"
                    />
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
                                group
                            `}
                        >
                            <item.icon
                                size={22}
                                className={`${isActive ? (isDarkMode ? 'text-white' : 'text-gray-900') : 'text-gray-400'} group-hover:scale-110 transition-transform duration-300`}
                            />
                            <span className="font-medium flex-1 text-left">{item.label}</span>
                            {isActive && <ChevronRight size={18} />}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className={`p-4 space-y-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-700'} border-t`}>

                <div
                    className="relative px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800"
                    onClick={() => setOpenNotifications(!openNotifications)}

                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Bell size={20} className="text-amber-100" />

                                {notificaciones?.cantidad > 0 && (
                                    <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                                        {notificaciones.cantidad}
                                    </span>
                                )}
                            </div>

                            <div>
                                <p className="text-gray-200 text-sm font-medium">
                                    Notificaciones
                                </p>
                                <p className="text-gray-400 text-xs">
                                    {notificaciones?.cantidad || 0} pendientes
                                </p>
                            </div>
                        </div>

                        <button
                            className="text-gray-400 hover:text-white"
                        >
                            <ChevronRight
                                size={18}
                                className={`transition-transform duration-200 ${openNotifications ? 'rotate-90' : ''
                                    }`}
                            />
                        </button>
                        {openNotifications && (
                            <div
                                className="
            absolute
            left-[calc(100%+20px)]
            top-(-40) 
            w-96  {/* 1. Más ancho (de w-80 a w-96) */}
            bg-white
            rounded-xl
            shadow-2xl
            border border-gray-200
            z-[9999]
        "
                            >
                                <div className="px-5 py-4 border-b border-gray-200"> {/* 2. Más padding en cabecera */}
                                    <h3 className="text-lg font-bold text-gray-800"> {/* 3. Título más grande */}
                                        Notificaciones
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1"> {/* 4. Subtítulo más grande */}
                                        Clientes con deuda mayor a 30 días
                                    </p>
                                </div>

                                <div className="max-h-[28rem] overflow-y-auto"> {/* 5. Contenedor más alto (max-h-80 a 28rem) */}
                                    {notificaciones?.notificaciones?.length > 0 ? (
                                        notificaciones.notificaciones.map((n) => (
                                            <div
                                                key={n.idVenta}
                                                className="
                            px-5 py-4 {/* 6. Más padding en los elementos */}
                            border-b border-gray-100
                            hover:bg-gray-50
                            transition-colors
                        "
                                            >
                                                <p className="text-base font-semibold text-gray-800"> {/* 7. Nombre más grande */}
                                                    {n.cliente}
                                                </p>

                                                <p className="text-sm text-gray-500 mt-1"> {/* 8. Días de mora más grandes */}
                                                    {n.diasMora} días de mora
                                                </p>

                                                <p className="text-base font-bold text-red-600 mt-1"> {/* 9. Precio más grande y marcado */}
                                                    ${Number(n.saldoPendiente).toLocaleString()}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-6 text-center text-gray-500 text-base"> {/* 10. Mensaje vacío más grande */}
                                            No hay notificaciones
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Dark Mode Toggle */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div className="flex items-center gap-3 flex-1">
                        {isDarkMode ? (
                            <Moon size={20} className="text-blue-400" />
                        ) : (
                            <Sun size={20} className="text-gray-400" />
                        )}
                        <span className="text-gray-300 text-sm font-medium">
                            {isDarkMode ? 'Modo oscuro' : 'Modo claro'}
                        </span>
                    </div>
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
                </div>

                {/* User Profile */}
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
            </div>



        </aside>
    );
};

export default Navbar;