import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, X } from "lucide-react";

export default function TablaConPaginacion({
  columns,
  data,
  pageSize = 5,
  isDarkMode = false,
  onRowClick,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar datos por búsqueda
  const filteredData = data.filter(row =>
    columns.some(col =>
      String(row[col.key]).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = filteredData.slice(startIndex, startIndex + pageSize);

  // Reset a página 1 cuando cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="w-full space-y-4">
      {/* Barra de búsqueda */}
      <div
        className={`
          p-4 rounded-xl border
          ${
            isDarkMode
              ? "bg-gray-900/50 border-gray-800"
              : "bg-white border-gray-200"
          }
        `}
        style={{
          boxShadow: isDarkMode
            ? "0 4px 12px rgba(0, 0, 0, 0.3)"
            : "0 4px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="relative">
          <Search
            size={18}
            className={`
              absolute left-3 top-1/2 -translate-y-1/2
              ${isDarkMode ? "text-gray-500" : "text-gray-400"}
            `}
          />
          <input
            type="text"
            placeholder="Buscar en la tabla..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`
              w-full pl-10 pr-10 py-2.5 rounded-lg text-sm
              transition-all duration-200
              focus:outline-none focus:ring-2
              ${
                isDarkMode
                  ? "bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:ring-blue-500/50 focus:border-blue-500"
                  : "bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500/50 focus:border-blue-500"
              }
            `}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className={`
                absolute right-3 top-1/2 -translate-y-1/2
                p-1 rounded-md transition-colors
                ${
                  isDarkMode
                    ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                    : "hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                }
              `}
              title="Limpiar búsqueda"
            >
              <X size={16} />
            </button>
          )}
        </div>
        {searchTerm && (
          <p
            className={`
              text-xs mt-2
              ${isDarkMode ? "text-gray-500" : "text-gray-600"}
            `}
          >
            {filteredData.length === 0
              ? "No se encontraron resultados"
              : `${filteredData.length} resultado${filteredData.length !== 1 ? "s" : ""} encontrado${filteredData.length !== 1 ? "s" : ""}`}
          </p>
        )}
      </div>

      {/* Tabla con diseño moderno */}
      <div
        className={`
          relative overflow-hidden rounded-2xl
          ${
            isDarkMode
              ? "bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800"
              : "bg-gradient-to-br from-white via-gray-50 to-gray-100"
          }
        `}
        style={{
          boxShadow: isDarkMode
            ? "0 20px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)"
            : "0 20px 60px -15px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Efecto de brillo sutil en la parte superior */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: isDarkMode
              ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)"
              : "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
          }}
        />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className={`
                  text-xs font-semibold uppercase tracking-wider
                  ${
                    isDarkMode
                      ? "bg-gray-800/50 text-gray-400 border-b border-gray-700/50"
                      : "bg-gray-100/80 text-gray-600 border-b border-gray-200"
                  }
                `}
              >
                {columns.map((col, idx) => (
                  <th
                    key={col.key}
                    className={`
                      px-6 py-4 text-left
                      ${idx === 0 ? "pl-8" : ""}
                      ${idx === columns.length - 1 ? "pr-8" : ""}
                    `}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className={`px-6 py-16 text-center ${
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isDarkMode ? "bg-gray-800" : "bg-gray-200"
                        }`}
                      >
                        {searchTerm ? (
                          <Search size={24} className={isDarkMode ? "text-gray-600" : "text-gray-400"} />
                        ) : (
                          <span className="text-2xl">📭</span>
                        )}
                      </div>
                      <p className="font-medium">
                        {searchTerm ? "No se encontraron resultados" : "No hay datos para mostrar"}
                      </p>
                      {searchTerm && (
                        <p className="text-sm">
                          Intenta con otros términos de búsqueda
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                currentData.map((row, index) => (
                  <tr
                    key={index}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`
                      group transition-all duration-200
                      ${onRowClick ? "cursor-pointer" : ""}
                      ${
                        isDarkMode
                          ? "border-b border-gray-800/50 hover:bg-gray-800/40"
                          : "border-b border-gray-200/50 hover:bg-gray-50/80"
                      }
                    `}
                  >
                    {columns.map((col, idx) => (
                      <td
                        key={col.key}
                        className={`
                          px-6 py-4 text-sm
                          ${idx === 0 ? "pl-8 font-medium" : ""}
                          ${idx === columns.length - 1 ? "pr-8" : ""}
                          ${
                            isDarkMode
                              ? "text-gray-300 group-hover:text-gray-200"
                              : "text-gray-700 group-hover:text-gray-900"
                          }
                        `}
                      >
                      {col.render ? col.render(row) : row[col.key]}                      
                    </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer con paginación mejorada */}
      <div
        className={`
          flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4
          px-4 py-3 rounded-xl
          ${
            isDarkMode
              ? "bg-gray-900/50 text-gray-400 border border-gray-800"
              : "bg-white/80 text-gray-600 border border-gray-200"
          }
        `}
      >
        {/* Información de registros */}
        <div className="text-sm flex items-center gap-2">
          <span className={isDarkMode ? "text-gray-500" : "text-gray-500"}>
            Mostrando
          </span>
          <span
            className={`
              px-2 py-0.5 rounded-md font-semibold text-xs
              ${
                isDarkMode
                  ? "bg-gray-800 text-gray-200"
                  : "bg-gray-100 text-gray-800"
              }
            `}
          >
            {Math.min(startIndex + 1, filteredData.length)}
            {" - "}
            {Math.min(startIndex + pageSize, filteredData.length)}
          </span>
          <span className={isDarkMode ? "text-gray-500" : "text-gray-500"}>
            de
          </span>
          <span
            className={`
              px-2 py-0.5 rounded-md font-semibold text-xs
              ${
                isDarkMode
                  ? "bg-gray-800 text-gray-200"
                  : "bg-gray-100 text-gray-800"
              }
            `}
          >
            {filteredData.length}
          </span>
          {searchTerm && filteredData.length !== data.length && (
            <span className="text-xs">
              (filtrado de {data.length})
            </span>
          )}
        </div>

        {/* Controles de paginación */}
        <div className="flex items-center gap-2">
          {/* Primera página */}
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`
              p-2 rounded-lg transition-all duration-200
              disabled:opacity-30 disabled:cursor-not-allowed
              ${
                isDarkMode
                  ? "hover:bg-gray-800 text-gray-400 hover:text-gray-200"
                  : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              }
            `}
            title="Primera página"
          >
            <ChevronsLeft size={16} />
          </button>

          {/* Anterior */}
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`
              p-2 rounded-lg transition-all duration-200
              disabled:opacity-30 disabled:cursor-not-allowed
              ${
                isDarkMode
                  ? "hover:bg-gray-800 text-gray-400 hover:text-gray-200"
                  : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              }
            `}
            title="Página anterior"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Números de página */}
          <div className="hidden sm:flex items-center gap-1">
            {getPageNumbers().map((page, idx) => (
              page === '...' ? (
                <span
                  key={`ellipsis-${idx}`}
                  className={`px-2 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`}
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`
                    min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${
                      currentPage === page
                        ? isDarkMode
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                          : "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                        : isDarkMode
                        ? "hover:bg-gray-800 text-gray-400 hover:text-gray-200"
                        : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                    }
                  `}
                >
                  {page}
                </button>
              )
            ))}
          </div>

          {/* Indicador simple en móvil */}
          <div
            className={`
              sm:hidden px-3 py-1 rounded-lg text-xs font-medium
              ${
                isDarkMode
                  ? "bg-gray-800 text-gray-300"
                  : "bg-gray-100 text-gray-700"
              }
            `}
          >
            {currentPage} / {totalPages}
          </div>

          {/* Siguiente */}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`
              p-2 rounded-lg transition-all duration-200
              disabled:opacity-30 disabled:cursor-not-allowed
              ${
                isDarkMode
                  ? "hover:bg-gray-800 text-gray-400 hover:text-gray-200"
                  : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              }
            `}
            title="Página siguiente"
          >
            <ChevronRight size={16} />
          </button>

          {/* Última página */}
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`
              p-2 rounded-lg transition-all duration-200
              disabled:opacity-30 disabled:cursor-not-allowed
              ${
                isDarkMode
                  ? "hover:bg-gray-800 text-gray-400 hover:text-gray-200"
                  : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              }
            `}
            title="Última página"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}