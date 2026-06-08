import { Bell, ChevronRight } from "lucide-react";
import { useState } from "react";
import { getNotificacionesDeudores } from '../api/Notificaciones.js';

export default function NotificationsDropdown({
    notificaciones
}) {
    const [openNotifications, setOpenNotifications] = useState(false);

    return (
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
                >
                    <ChevronRight
                        size={18}
                        className={`transition-transform duration-200 ${openNotifications ? "rotate-90" : ""
                            }`}
                    />
                </button>
            </div>

            {openNotifications && (
                <div
                    className="
            absolute
            left-[calc(100%+20px)]
            -top-40
            w-96
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
                            px-5 py-4
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

                                    <p className="text-base font-bold text-600 mt-1"> {/* 9. Precio más grande y marcado */}
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
    );
}