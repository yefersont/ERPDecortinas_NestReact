import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { PrismaService } from 'src/prisma/prisma.service';
import { CryptoService, EncryptedData } from 'src/common/crypto/crypto.service';
import * as fs from 'fs';
import * as path from 'path';
import { numeroALetras } from 'src/common/utils/numero-letras.util';

@Injectable()
export class ExportService {
    constructor(private readonly prisma: PrismaService, private readonly cryptoService: CryptoService) { }

    async exportCotizacionesToExcel() {

        // Variable para definir el archivo
        const libro = new ExcelJS.Workbook();

        // Propiedades del archivo
        libro.creator = 'Decortinas';
        libro.lastModifiedBy = 'Decortinas';
        libro.created = new Date();
        libro.modified = new Date();
        libro.lastPrinted = new Date();

        // Propiedades descriptivas
        libro.subject = 'Cotizaciones';
        libro.description =
            'Listado de cotizaciones generado desde el sistema ERP Decortinas';
        libro.keywords = 'cotizaciones, ventas, ERP, Decortinas';
        libro.category = 'Reportes';

        // Hoja de datos
        const hoja = libro.addWorksheet('Cotizaciones');

        // Buscar cotizaciones
        const cotizaciones = await this.prisma.cotizaciones.findMany(
            {
                include: {
                    cliente: true,
                    ventas: true,
                    detalles: true,
                }
            }
        )

        // Definir columnas
        hoja.columns = [
            { header: 'ID Cotización', key: 'idCotizacion', width: 15 },
            { header: 'Cliente', key: 'cliente', width: 30 },
            { header: 'Fecha', key: 'fecha', width: 20 },
            { header: 'Valor Total', key: 'valorTotal', width: 18 },
            { header: 'Estado Pago', key: 'estadoPago', width: 18 },
            { header: 'Total Venta', key: 'totalVenta', width: 18 },
            { header: 'Saldo Pendiente', key: 'saldoPendiente', width: 20 },
            { header: 'Cantidad Productos', key: 'cantidadProductos', width: 22 },
        ];

        // Agregar datos
        cotizaciones.forEach(c => {
            hoja.addRow({
                idCotizacion: c.idCotizacion,
                cliente: `${c.cliente?.nombre} ${c.cliente?.apellidos}`,
                fecha: new Date(c.fecha),
                valorTotal: Number(c.valor_total),
                estadoPago: c.ventas?.[0]?.estado_pago ?? 'SIN VENTA',
                totalVenta: Number(c.ventas?.[0]?.total ?? 0),
                saldoPendiente: Number(c.ventas?.[0]?.saldo_pendiente ?? 0),
                cantidadProductos: c.detalles?.length ?? 0,
            });
        });

        // Formatear columnas

        // Encabezados en negrita
        hoja.getRow(1).font = { bold: true };

        // Formato monetario
        hoja.getColumn('valorTotal').numFmt = '"$"#,##0';

        // Formato de fecha
        hoja.getColumn('fecha').numFmt = 'dd/mm/yyyy';

        // Alineación
        hoja.getColumn('idCotizacion').alignment = { horizontal: 'center' };
        hoja.getColumn('fecha').alignment = { horizontal: 'center' };
        hoja.getColumn('valorTotal').alignment = { horizontal: 'right' };
        hoja.getColumn('estadoPago').alignment = { horizontal: 'center' };

        // Congelar encabezado
        hoja.views = [{ state: 'frozen', ySplit: 1 }];

        // Filtro automático de Excel
        hoja.autoFilter = {
            from: 'A1',
            to: 'G1',
        };

        return libro;


    }

    async exportVentasToExcel() {


        // Variable para definir el archivo
        const libro = new ExcelJS.Workbook();

        // Propiedades del archivo
        libro.creator = 'Decortinas';
        libro.lastModifiedBy = 'Decortinas';
        libro.created = new Date();
        libro.modified = new Date();
        libro.lastPrinted = new Date();

        // Propiedades descriptivas
        libro.subject = 'Ventas';
        libro.description =
            'Listado de ventas generado desde el sistema ERP Decortinas';
        libro.keywords = 'ventas, ERP, Decortinas';
        libro.category = 'Reportes';

        // Hoja de datos
        const hoja = libro.addWorksheet('Ventas');

        // Buscar ventas
        const ventas = await this.prisma.ventas.findMany({
            include: {
                cotizacion: {
                    include: {
                        cliente: true
                    }
                },
                abonos: true
            }
        });

        // Definir columnas

        hoja.columns = [
            { header: 'ID Cotización', key: 'idCotizacion', width: 15 },
            { header: 'Cliente', key: 'cliente', width: 30 },
            { header: 'Documento', key: 'documento', width: 20 },
            { header: 'Teléfono', key: 'telefono', width: 20 },
            { header: 'Fecha', key: 'fecha', width: 20 },
            { header: 'Valor Total', key: 'valorTotal', width: 18 },
            { header: 'Estado Pago', key: 'estadoPago', width: 18 },
        ];


        const crypto = this.cryptoService;

        ventas.forEach(v => {
            const cliente = v.cotizacion?.cliente;

            const documento = crypto.isValidEncryptedData(cliente?.cedula_enc)
                ? crypto.decrypt(cliente.cedula_enc)
                : '';

            const telefono = crypto.isValidEncryptedData(cliente?.telefono_enc)
                ? crypto.decrypt(cliente.telefono_enc)
                : '';

            hoja.addRow({
                idCotizacion: v.cotizacion?.idCotizacion ?? '',
                cliente: `${cliente?.nombre ?? ''} ${cliente?.apellidos ?? ''}`.trim(),
                documento,
                telefono,
                fecha: v.fecha_venta ? new Date(v.fecha_venta) : '',
                valorTotal: Number(v.total ?? 0),
                estadoPago: v.estado_pago ?? '',
            });
        });


        // Formatear columnas
        hoja.getRow(1).font = { bold: true };

        // Formatos
        hoja.getColumn('valorTotal').numFmt = '"$"#,##0';
        hoja.getColumn('fecha').numFmt = 'dd/mm/yyyy';

        // Alineación
        hoja.getColumn('idCotizacion').alignment = { horizontal: 'center' };
        hoja.getColumn('fecha').alignment = { horizontal: 'center' };
        hoja.getColumn('valorTotal').alignment = { horizontal: 'right' };
        hoja.getColumn('estadoPago').alignment = { horizontal: 'center' };

        // Congelar header
        hoja.views = [{ state: 'frozen', ySplit: 1 }];

        // Filtros de Excel
        hoja.autoFilter = {
            from: 'A1',
            to: 'G1',
        };

        return libro;

    }

    async exportClientesToExcel() {

        const libro = new ExcelJS.Workbook();

        // Propiedades del archivo
        libro.creator = 'Decortinas';
        libro.lastModifiedBy = 'Decortinas';
        libro.created = new Date();
        libro.modified = new Date();
        libro.lastPrinted = new Date();

        // Propiedades descriptivas
        libro.subject = 'Clientes';
        libro.description =
            'Listado de clientes generado desde el sistema ERP Decortinas';
        libro.keywords = 'clientes, ERP, Decortinas';
        libro.category = 'Reportes';

        // Hoja de datos
        const hoja = libro.addWorksheet('Clientes');

        // Buscar clientes
        const clientes = await this.prisma.clientes.findMany();

        // Definir columnas
        hoja.columns = [
            { header: 'ID Cliente', key: 'idCliente', width: 15 },
            { header: 'Nombre', key: 'nombre', width: 30 },
            { header: 'Apellidos', key: 'apellidos', width: 30 },
            { header: 'Documento', key: 'documento', width: 20 },
            { header: 'Teléfono', key: 'telefono', width: 20 },
        ];

        // Agregar datos
        clientes.forEach(data => {


            const cedulaEnc = data.cedula_enc;
            const telefonoEnc = data.telefono_enc;

            hoja.addRow({
                idCliente: data.idCliente,
                nombre: data.nombre,
                apellidos: data.apellidos,
                documento: this.cryptoService.isValidEncryptedData(cedulaEnc)
                    ? this.cryptoService.decrypt(cedulaEnc)
                    : '',
                telefono: this.cryptoService.isValidEncryptedData(telefonoEnc)
                    ? this.cryptoService.decrypt(telefonoEnc)
                    : '',
            });
        });


        // Formatear columnas
        hoja.getRow(1).font = { bold: true };

        // Formatos
        hoja.getColumn('idCliente').numFmt = '#,##0';
        hoja.getColumn('documento').numFmt = '#,##0';

        // Alineación
        hoja.getColumn('idCliente').alignment = { horizontal: 'center' };
        hoja.getColumn('documento').alignment = { horizontal: 'center' };

        // Congelar header
        hoja.views = [{ state: 'frozen', ySplit: 1 }];

        // Filtros de Excel
        hoja.autoFilter = {
            from: 'A1',
            to: 'G1',
        };

        return libro;

    }

    async exportVentaFacturaPDF(idVenta: number): Promise<Buffer> {
        // Buscar la venta con todos los datos necesarios
        const venta = await this.prisma.ventas.findUnique({
            where: { idVenta },
            include: {
                cotizacion: {
                    include: {
                        cliente: true,
                        detalles: {
                            include: {
                                tipoProducto: true
                            }
                        }
                    }
                },
                abonos: {
                    orderBy: {
                        fecha_abono: 'desc'
                    }
                }
            }
        });

        if (!venta) {
            throw new Error(`Venta con ID ${idVenta} no encontrada`);
        }

        return new Promise((resolve, reject) => {
            let errorMsg = '';

            try {
                const doc = new PDFDocument({
                    size: 'LETTER',
                    margins: { top: 30, bottom: 30, left: 40, right: 40 }
                });

                const chunks: Buffer[] = [];

                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);

                const pageWidth = 612;
                const margin = 40;
                const contentWidth = pageWidth - (margin * 2);
                // =========================================
                //  RUTA DEL LOGO
                const logoPath = path.join(process.cwd(), 'src/assets/images/DecortinasImg.png');
                // SECCIÓN SUPERIOR: LOGO (BLANCA)
                // ============================================
                doc.rect(margin, 30, contentWidth, 70)
                    .fillAndStroke('#ffffff', '#cccccc'); // Borde gris

                // Logo a la izquierda - tamaño ajustado para no deformar
                const logoWidth = 170;
                const logoHeight = 85;
                const logoX = margin + 10; // Logo alineado a la izquierda
                const logoY = 25;

                try {
                    doc.image(logoPath, logoX, logoY, {
                        width: logoWidth,
                        height: logoHeight,
                        fit: [logoWidth, logoHeight],
                        align: 'center',
                        valign: 'center'
                    });

                } catch (error) {
                    // Si no encuentra el logo, muestra texto
                    doc.fontSize(12)
                        .fillColor('#000000')
                        .text('DECORTINAS Y PERSIANAS', margin, 55, {
                            width: contentWidth,
                            align: 'center'
                        });
                }

                // ============================================
                // TÍTULO Y NÚMERO DE FACTURA (dentro del header)
                // ============================================
                const headerTextY = 42; // Posición vertical dentro del header

                doc.fontSize(9)
                    .fillColor('#000000')
                    .text('Factura de venta', margin + contentWidth / 2, headerTextY, {
                        width: contentWidth / 2 - 10,
                        align: 'right'
                    });

                doc.fontSize(9)
                    .fillColor('#FF0000')
                    .text(`No ${venta.idVenta.toString().padStart(4, '0')}`, margin + contentWidth / 2, headerTextY + 15, {
                        width: contentWidth / 2 - 10,
                        align: 'right'
                    });

                // Fechas en el header
                doc.fontSize(9)
                    .fillColor('#000000')
                    .text(`Fecha: ${new Date(venta.fecha_venta).toLocaleDateString('es-ES')}`, margin + contentWidth / 2, headerTextY + 30, {
                        width: contentWidth / 2 - 10,
                        align: 'right'
                    });

                doc.fontSize(9)
                    .fillColor('#000000')
                    .text(`Cotización #${venta.idCotizacion}`, margin + contentWidth / 2, headerTextY + 45, {
                        width: contentWidth / 2 - 10,
                        align: 'right'
                    });

                // ============================================
                // INFORMACIÓN DEL CLIENTE
                // ============================================
                const infoY = 110; // Comienza después del header
                const lineHeight = 18;

                doc.rect(margin, infoY - 5, contentWidth, 80)
                    .stroke('#cccccc'); // Borde gris

                const cliente = venta.cotizacion.cliente;
                const clienteNombre = `${cliente.nombre} ${cliente.apellidos}`;

                let documento = '';
                if (this.cryptoService.isValidEncryptedData(cliente.cedula_enc)) {
                    documento = this.cryptoService.decrypt(cliente.cedula_enc);
                }

                let telefono = '';
                if (this.cryptoService.isValidEncryptedData(cliente.telefono_enc)) {
                    telefono = this.cryptoService.decrypt(cliente.telefono_enc);
                }

                const direccionCliente = this.cryptoService.isValidEncryptedData(cliente.direccion_enc)
                    ? this.cryptoService.decrypt(cliente.direccion_enc)
                    : '';

                // Datos del cliente - ahora ocupa todo el ancho
                doc.fontSize(9)
                    .fillColor('#000000')
                    .text('Cliente:', margin + 5, infoY)
                    .text('Dirección:', margin + 5, infoY + lineHeight)
                    .text('Teléfono:', margin + 5, infoY + lineHeight * 2)
                    .text('NIT.', margin + 5, infoY + lineHeight * 3);

                doc.text(clienteNombre, margin + 60, infoY)
                    .text(direccionCliente, margin + 60, infoY + lineHeight)
                    .text(telefono, margin + 60, infoY + lineHeight * 2)
                    .text(documento, margin + 60, infoY + lineHeight * 3);

                // ============================================
                // TABLA DE PRODUCTOS
                // ============================================
                const tableY = infoY + 90;
                const tableHeight = 200;

                doc.rect(margin, tableY, contentWidth, tableHeight)
                    .stroke('#cccccc'); // Borde gris

                const col1X = margin + 5;
                const col2X = margin + 60;
                const col3X = margin + contentWidth - 80;

                doc.fontSize(8)
                    .fillColor('#000000')
                    .text('CANTIDAD', col1X, tableY + 5)
                    .text('DESCRIPCION', col2X, tableY + 5)
                    .text('VALOR', col3X, tableY + 5, { align: 'right', width: 70 });

                doc.moveTo(margin, tableY + 18)
                    .lineTo(margin + contentWidth, tableY + 18)
                    .stroke('#cccccc'); // Línea gris

                doc.moveTo(col2X - 5, tableY)
                    .lineTo(col2X - 5, tableY + tableHeight)
                    .stroke('#cccccc'); // Línea gris

                doc.moveTo(col3X - 10, tableY)
                    .lineTo(col3X - 10, tableY + tableHeight)
                    .stroke('#cccccc'); // Línea gris

                let productY = tableY + 25;
                const detalles = venta.cotizacion.detalles;

                detalles.forEach((detalle) => {
                    const descripcion = `${detalle.tipoProducto.nombre_tp} (${detalle.ancho}m x ${detalle.alto}m)`;

                    doc.fontSize(9)
                        .text('1', col1X + 10, productY, { width: 40, align: 'center' })
                        .text(descripcion, col2X, productY, { width: col3X - col2X - 20 })
                        .text(
                            new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(detalle.precio)),
                            col3X,
                            productY,
                            { align: 'right', width: 70 }
                        );
                    productY += 20;
                });

                // ============================================
                // SECCIÓN SON
                // ============================================
                const sonY = tableY + tableHeight + 8;
                const sonHeight = 30;

                doc.rect(margin, sonY, contentWidth, sonHeight)
                    .stroke('#cccccc'); // Borde gris

                const totalEnLetras = numeroALetras(Number(venta.total));

                doc.fontSize(8)
                    .fillColor('#000000')
                    .text('SON:', margin + 5, sonY + 5)
                    .text(totalEnLetras, margin + 35, sonY + 5, {
                        width: contentWidth - 40
                    });

                // ============================================
                // FIRMAS
                // ============================================
                const firmasY = sonY + sonHeight + 8;
                const firmasHeight = 50;
                const firmaWidth = (contentWidth - 10) / 2;

                doc.rect(margin, firmasY, firmaWidth, firmasHeight)
                    .stroke('#cccccc'); // Borde gris

                doc.fontSize(8)
                    .text('Firma Envío', margin + 5, firmasY + 5);

                doc.fontSize(7)
                    .text('Nombre:', margin + 5, firmasY + firmasHeight - 25)
                    .text('CC:', margin + firmaWidth / 2, firmasY + firmasHeight - 25);

                doc.rect(margin + firmaWidth + 10, firmasY, firmaWidth, firmasHeight)
                    .stroke('#cccccc'); // Borde gris

                doc.fontSize(8)
                    .text('Firma Recibido', margin + firmaWidth + 15, firmasY + 5);

                doc.fontSize(7)
                    .text('Nombre:', margin + firmaWidth + 15, firmasY + firmasHeight - 25)
                    .text('CC:', margin + firmaWidth + 15 + firmaWidth / 2, firmasY + firmasHeight - 25);

                // ============================================
                // RESUMEN FINANCIERO
                // ============================================
                const resumenY = firmasY + firmasHeight + 8;
                const resumenWidth = 150;
                const resumenX = margin + contentWidth - resumenWidth;
                const resumenLineHeight = 18;

                const totalPagado = Number(venta.total) - Number(venta.saldo_pendiente);

                // TOTAL
                doc.rect(resumenX, resumenY, resumenWidth, resumenLineHeight)
                    .stroke('#cccccc'); // Borde gris

                doc.fontSize(9)
                    .fillColor('#000000')
                    .text('TOTAL:', resumenX + 5, resumenY + 5)
                    .text(
                        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(venta.total)),
                        resumenX + 75,
                        resumenY + 5,
                        { align: 'right', width: 70 }
                    );

                // PAGADO
                doc.rect(resumenX, resumenY + resumenLineHeight, resumenWidth, resumenLineHeight)
                    .stroke('#cccccc'); // Borde gris

                doc.text('PAGADO:', resumenX + 5, resumenY + resumenLineHeight + 5)
                    .text(
                        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(totalPagado),
                        resumenX + 75,
                        resumenY + resumenLineHeight + 5,
                        { align: 'right', width: 70 }
                    );

                // SALDO PENDIENTE (fondo negro)
                doc.rect(resumenX, resumenY + resumenLineHeight * 2, resumenWidth, resumenLineHeight)
                    .fillAndStroke('#000000', '#000000');

                doc.fillColor('#FFFFFF')
                    .text('SALDO:', resumenX + 5, resumenY + resumenLineHeight * 2 + 5)
                    .text(
                        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(venta.saldo_pendiente)),
                        resumenX + 75,
                        resumenY + resumenLineHeight * 2 + 5,
                        { align: 'right', width: 70 }
                    );

                // Estado
                doc.fillColor('#000000')
                    .fontSize(8)
                    .text(`Estado: ${venta.estado_pago}`, resumenX, resumenY + resumenLineHeight * 3 + 10, {
                        width: resumenWidth,
                        align: 'center'
                    });

                // HISTORIAL DE ABONOS
                if (venta.abonos.length > 0) {
                    const abonosY = resumenY + resumenLineHeight * 3 + 15;

                    doc.fontSize(8)
                        .fillColor('#000000')
                        .text('Historial de Abonos:', margin, abonosY, { underline: true });

                    let abonoY = abonosY + 12;
                    venta.abonos.forEach((abono) => {
                        doc.fontSize(7)
                            .text(
                                `${new Date(abono.fecha_abono).toLocaleDateString('es-ES')} - ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(abono.abono))}`,
                                margin + 10,
                                abonoY
                            );
                        abonoY += 10;
                    });
                }

                doc.end();


            } catch (error) {
                reject(error);
            }
        });
    }
}