import { useEffect, useState } from "react";
import { useTheme } from '../../context/ThemeContext';
import { getTipoProductos, createCostoTipoProducto, createTipoProductoCompleto } from '../../api/TipoProducto';
import { useToast } from '../../context/ToastContext';
import { Plus, Save, Search, X, Check } from 'lucide-react';

const ConfPage = () => {
    const { isDarkMode } = useTheme();
    const { showToast } = useToast();
    const [tipoProductos, setTipoProductos] = useState([]);
    const [precios, setPrecios] = useState({});
    const [initialPrecios, setInitialPrecios] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Búsqueda y Nuevo Producto
    const [searchQuery, setSearchQuery] = useState("");
    const [showNuevoForm, setShowNuevoForm] = useState(false);
    const [nuevoNombre, setNuevoNombre] = useState("");
    const [nuevoPrecio, setNuevoPrecio] = useState("");
    const [creating, setCreating] = useState(false);

    function formatNumber(value) {
        if (value === undefined || value === null) return '';
        const numericValue = value.toString().replace(/[^0-9]/g, '');
        if (!numericValue) return '';
        return new Intl.NumberFormat('es-CO', {
            minimumFractionDigits: 0
        }).format(parseInt(numericValue));
    }

    const loadTipoProductos = async () => {
        try {
            setLoading(true);
            const response = await getTipoProductos();
            const data = response.data.data;
            setTipoProductos(data);

            const iniciales = {};
            data.forEach(prod => {
                const costo = prod.costos?.[0]?.costo_base || 0;
                iniciales[prod.idTipo_producto] = formatNumber(costo.toString());
            });
            setPrecios(iniciales);
            setInitialPrecios(iniciales);
        } catch (error) {
            console.error(error);
            showToast("Error al cargar los tipos de producto", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTipoProductos();
    }, []);

    const handlePrecioChange = (id, value) => {
        const formatted = formatNumber(value);
        setPrecios(prev => ({
            ...prev,
            [id]: formatted
        }));
    };

    const handleNuevoClick = () => {
        setShowNuevoForm(prev => !prev);
        setNuevoNombre("");
        setNuevoPrecio("");
    };

    const handleCancelNuevo = () => {
        setShowNuevoForm(false);
        setNuevoNombre("");
        setNuevoPrecio("");
    };

    const handleCreateCompleto = async () => {
        if (!nuevoNombre.trim()) {
            showToast("El nombre del producto es requerido", "error");
            return;
        }
        const rawPrice = nuevoPrecio.replace(/[^0-9]/g, '');
        const precioNumerico = parseInt(rawPrice) || 0;
        if (precioNumerico <= 0) {
            showToast("El precio debe ser mayor a 0", "error");
            return;
        }

        setCreating(true);
        try {
            await createTipoProductoCompleto({
                nombre_tp: nuevoNombre.trim(),
                costo_base: precioNumerico
            });
            showToast("Producto creado correctamente", "success");
            setShowNuevoForm(false);
            setNuevoNombre("");
            setNuevoPrecio("");
            await loadTipoProductos();
        } catch (error) {
            console.error(error);
            showToast(error.response?.data?.message || "Error al crear el producto", "error");
        } finally {
            setCreating(false);
        }
    };

    const handleSave = async () => {
        const modificados = Object.keys(precios).filter(id => precios[id] !== initialPrecios[id]);

        if (modificados.length === 0) {
            showToast("No hay cambios para guardar", "info");
            return;
        }

        setSaving(true);
        try {
            await Promise.all(modificados.map(id => {
                const rawValue = precios[id].replace(/[^0-9]/g, '');
                const valorNumerico = parseInt(rawValue) || 0;
                return createCostoTipoProducto({
                    idTipo_producto: parseInt(id),
                    costo_base: valorNumerico
                });
            }));

            showToast("Precios actualizados correctamente", "success");
            await loadTipoProductos();
        } catch (error) {
            console.error(error);
            showToast("Error al guardar los precios", "error");
        } finally {
            setSaving(false);
        }
    };

    const filteredProductos = tipoProductos.filter(prod =>
        prod.nombre_tp.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className={`p-6 min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
        );
    }

    return (
        <div className={`p-4 sm:p-6 lg:p-8 ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="pb-6 border-b border-gray-200 dark:border-gray-800">
                    <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Configuraciones
                    </h1>
                    <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Administra productos y precios por m²
                    </p>
                </div>

                {/* Contenido (Tamaño normal/legible) */}
                <div className="space-y-4">
                    {/* Buscador + Botón Nuevo Producto */}
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <input
                                type="text"
                                placeholder="Buscar producto por nombre..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`
                                    w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                                    ${isDarkMode
                                        ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500/50'
                                        : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500/50'}
                                `}
                            />
                        </div>

                        <div className="w-56 flex justify-start">
                            <button
                                onClick={handleNuevoClick}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-xl
                                    text-sm font-medium transition-all duration-300
                                    ${isDarkMode
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-blue-500 hover:bg-blue-600 text-white'}
                                `}
                            >
                                <Plus size={15} />
                                Nuevo Producto
                            </button>
                        </div>
                    </div>

                    {/* Nuevo Producto Inline Form */}
                    {showNuevoForm && (
                        <div
                            className={`
                                flex
                                items-center
                                justify-between
                                py-2.5
                                px-3
                                border
                                border-dashed
                                ${isDarkMode ? 'bg-gray-900/40 border-blue-500/40' : 'bg-blue-50/20 border-blue-400/40'}
                                rounded-lg
                                gap-3
                            `}
                        >
                            <div className="flex-1 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Escribe el nombre del nuevo producto..."
                                    value={nuevoNombre}
                                    onChange={(e) => setNuevoNombre(e.target.value)}
                                    className={`
                                        flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                                        ${isDarkMode
                                            ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500/50'
                                            : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500/50'}
                                    `}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="relative rounded-lg shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>$</span>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="0"
                                        value={nuevoPrecio}
                                        onChange={(e) => setNuevoPrecio(formatNumber(e.target.value))}
                                        className={`
                                            block w-36 pl-7 pr-12 py-2 text-sm border rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500
                                            ${isDarkMode
                                                ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500/50'
                                                : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500/50'}
                                        `}
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>/ m²</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCreateCompleto}
                                    disabled={creating}
                                    className={`
                                        p-2 rounded-lg text-white transition-colors
                                        ${creating ? 'opacity-50 cursor-not-allowed' : ''}
                                        ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}
                                    `}
                                    title="Crear Producto"
                                >
                                    <Check size={16} />
                                </button>

                                <button
                                    onClick={handleCancelNuevo}
                                    disabled={creating}
                                    className={`
                                        p-2 rounded-lg transition-colors
                                        ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}
                                    `}
                                    title="Cancelar"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* List Container - Natural Scroll */}
                    <div className="space-y-1">
                        {filteredProductos.map((producto) => (
                            <div
                                key={producto.idTipo_producto}
                                className={`
                                    flex
                                    items-center
                                    gap-6
                                    py-2.5
                                    border-b
                                    ${isDarkMode ? 'border-gray-800/80' : 'border-gray-100'}
                                    hover:bg-gray-100/30
                                    dark:hover:bg-gray-800/10
                                    transition-colors
                                    px-2
                                    rounded-lg
                                `}
                            >
                                <span className={`text-base flex-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                    {producto.nombre_tp}
                                </span>

                                <div className="flex items-center gap-2 w-56">
                                    <div className="relative rounded-lg shadow-sm">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>$</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={precios[producto.idTipo_producto] || ""}
                                            onChange={(e) => handlePrecioChange(producto.idTipo_producto, e.target.value)}
                                            placeholder="0"
                                            className={`
                                                block w-40 pl-7 pr-12 py-2 text-sm border rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500
                                                ${isDarkMode
                                                    ? 'bg-gray-800 border-gray-700 text-white focus:ring-blue-500/50'
                                                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500/50'}
                                            `}
                                        />
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>/ m²</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredProductos.length === 0 && (
                            <div className={`text-center py-8 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                No se encontraron productos
                            </div>
                        )}
                    </div>

                    {/* Save Changes Button */}
                    <div className="flex justify-start pt-8 pb-4">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={`
                            flex items-center gap-2 px-6 py-2.5 rounded-xl
                            text-sm font-medium transition-all duration-300
                            ${saving ? 'opacity-70 cursor-wait' : ''}
                            ${isDarkMode
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'}
                        `}
                        >
                            {saving ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Save size={16} />
                            )}
                            {saving ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfPage;