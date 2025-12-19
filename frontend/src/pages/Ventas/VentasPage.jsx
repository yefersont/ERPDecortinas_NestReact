import React from 'react';
import { useEffect } from 'react';

const VentasPage = () => {
    useEffect(() => {
        console.log('VentasPage');
    }, []);
    return (
        <div>
            <h1>Ventas</h1>
        </div>
    );
};

export default VentasPage;
