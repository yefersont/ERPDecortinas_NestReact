import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Loader = ({ text, fullScreen = false }) => {
    const { isDarkMode } = useTheme();
    
    // Si es fullScreen, usamos fixed para cubrir toda la ventana.
    // Si no, usamos h-full para llenar el contenedor padre (el área de contenido principal).
    const positionClass = fullScreen 
        ? 'fixed inset-0 z-[9999]' 
        : 'w-full h-full min-h-[50vh]'; // min-h para asegurar que se vea si el contenido es poco

    return (
        <div className={`${positionClass} flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{text}</p>
            </div>
        </div>
    );
};

export default Loader;
