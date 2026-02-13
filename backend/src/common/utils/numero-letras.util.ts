/**
 * Convierte un número a su representación en palabras en español
 * @param numero - El número a convertir
 * @returns El número convertido a letras en español
 */
export function numeroALetras(numero: number): string {
    const unidades = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
    const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
    const especiales = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
    const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

    if (numero === 0) return 'CERO';
    if (numero < 0) return 'MENOS ' + numeroALetras(Math.abs(numero));

    // Redondear a entero
    numero = Math.floor(numero);

    // Función auxiliar para convertir números menores a 1000
    function convertirMenorA1000(n: number): string {
        if (n === 0) return '';
        if (n === 100) return 'CIEN';

        let resultado = '';

        // Centenas
        const c = Math.floor(n / 100);
        if (c > 0) {
            resultado += centenas[c] + ' ';
            n %= 100;
        }

        // Decenas y unidades
        if (n >= 10 && n < 20) {
            resultado += especiales[n - 10];
        } else {
            const d = Math.floor(n / 10);
            const u = n % 10;

            if (d > 0) {
                resultado += decenas[d];
                if (u > 0) {
                    resultado += (d === 2 ? 'I' : ' Y ') + unidades[u];
                }
            } else if (u > 0) {
                resultado += unidades[u];
            }
        }

        return resultado.trim();
    }

    let resultado = '';

    // Millones
    const millones = Math.floor(numero / 1000000);
    if (millones > 0) {
        if (millones === 1) {
            resultado += 'UN MILLÓN ';
        } else {
            resultado += convertirMenorA1000(millones) + ' MILLONES ';
        }
        numero %= 1000000;
    }

    // Miles
    const miles = Math.floor(numero / 1000);
    if (miles > 0) {
        if (miles === 1) {
            resultado += 'MIL ';
        } else {
            resultado += convertirMenorA1000(miles) + ' MIL ';
        }
        numero %= 1000;
    }

    // Cientos
    if (numero > 0) {
        resultado += convertirMenorA1000(numero);
    }

    return resultado.trim() + ' PESOS';
}
