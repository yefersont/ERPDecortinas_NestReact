import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Loader = ({text}) => {
    const { isDarkMode } = useTheme();
    return (
        <div className={`flex items-center justify-center h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{text}</p>
            </div>
        </div>
    );
};

export default Loader;
