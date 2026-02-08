import {Injectable} from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { PrismaService } from 'src/prisma/prisma.service';
import { CryptoService, EncryptedData } from 'src/common/crypto/crypto.service';

@Injectable()
export class ExportService {
    constructor(private readonly prisma: PrismaService, private readonly cryptoService: CryptoService) {}

    async exportCotizacionesToExcel(){

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
        const cotizaciones  = await this.prisma.cotizaciones.findMany(
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

    async exportVentasToExcel(){


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
            try {
                const doc = new PDFDocument({ 
                    size: 'LETTER',
                    margins: { top: 50, bottom: 50, left: 50, right: 50 }
                });

                const chunks: Buffer[] = [];

                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);

                // Colores en blanco y negro
                const primaryColor = '#000000';
                const secondaryColor = '#000000';
                const textColor = '#000000';

                // ENCABEZADO DE LA EMPRESA
                doc.fontSize(24)
                   .fillColor(primaryColor)
                   .text('DECORTINAS', { align: 'center' });

                doc.fontSize(10)
                   .fillColor(secondaryColor)
                   .text('ERP - Sistema de Gestión', { align: 'center' })
                   .moveDown(0.5);

                // TÍTULO FACTURA
                doc.fontSize(18)
                   .fillColor(textColor)
                   .text('FACTURA DE VENTA', { align: 'center' })
                   .moveDown(1);

                // INFORMACIÓN DE LA VENTA
                const currentY = doc.y;
                
                // Columna izquierda - Info de factura
                doc.fontSize(10)
                   .fillColor(secondaryColor)
                   .text('Factura No:', 50, currentY)
                   .fillColor(textColor)
                   .text(`#${venta.idVenta}`, 150, currentY);

                doc.fillColor(secondaryColor)
                   .text('Fecha:', 50, currentY + 15)
                   .fillColor(textColor)
                   .text(new Date(venta.fecha_venta).toLocaleDateString('es-ES'), 150, currentY + 15);

                doc.fillColor(secondaryColor)
                   .text('Cotización:', 50, currentY + 30)
                   .fillColor(textColor)
                   .text(`#${venta.idCotizacion}`, 150, currentY + 30);

                // Columna derecha - Info del cliente
                const cliente = venta.cotizacion.cliente;
                const clienteNombre = `${cliente.nombre} ${cliente.apellidos}`;
                
                doc.fillColor(secondaryColor)
                   .text('Cliente:', 320, currentY)
                   .fillColor(textColor)
                   .text(clienteNombre, 380, currentY, { width: 170 });

                // Desencriptar documento si existe
                if (this.cryptoService.isValidEncryptedData(cliente.cedula_enc)) {
                    const documento = this.cryptoService.decrypt(cliente.cedula_enc);
                    doc.fillColor(secondaryColor)
                       .text('Documento:', 320, currentY + 15)
                       .fillColor(textColor)
                       .text(documento, 380, currentY + 15);
                }

                // Desencriptar teléfono si existe
                if (this.cryptoService.isValidEncryptedData(cliente.telefono_enc)) {
                    const telefono = this.cryptoService.decrypt(cliente.telefono_enc);
                    doc.fillColor(secondaryColor)
                       .text('Teléfono:', 320, currentY + 30)
                       .fillColor(textColor)
                       .text(telefono, 380, currentY + 30);
                }

                doc.moveDown(3);

                // LÍNEA SEPARADORA
                doc.strokeColor('#000000')
                   .lineWidth(2)
                   .moveTo(50, doc.y)
                   .lineTo(562, doc.y)
                   .stroke();

                doc.moveDown(1);

                // TABLA DE PRODUCTOS
                doc.fontSize(12)
                   .fillColor(textColor)
                   .text('Detalle de Productos', { underline: true })
                   .moveDown(0.5);

                // Encabezados de tabla
                const tableTop = doc.y;
                doc.fontSize(9)
                   .fillColor('#ffffff')
                   .rect(50, tableTop, 512, 20)
                   .fill('#000000');

                doc.fillColor('#ffffff')
                   .text('Producto', 55, tableTop + 5, { width: 200 })
                   .text('Ancho', 260, tableTop + 5, { width: 50 })
                   .text('Alto', 315, tableTop + 5, { width: 50 })
                   .text('Cant.', 370, tableTop + 5, { width: 40 })
                   .text('Precio Unit.', 415, tableTop + 5, { width: 70 })
                   .text('Subtotal', 490, tableTop + 5, { width: 70, align: 'right' });

                let yPosition = tableTop + 25;
                const detalles = venta.cotizacion.detalles;

                detalles.forEach((detalle, index) => {
                    const bgColor = '#ffffff';
                    
                    doc.rect(50, yPosition - 2, 512, 20)
                       .fill(bgColor);

                    doc.fillColor(textColor)
                       .text(detalle.tipoProducto.nombre_tp, 55, yPosition, { width: 200 })
                       .text(`${detalle.ancho}m`, 260, yPosition, { width: 50 })
                       .text(`${detalle.alto}m`, 315, yPosition, { width: 50 })
                       .text('1', 370, yPosition, { width: 40 })
                       .text(
                           new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(detalle.precio)),
                           415,
                           yPosition,
                           { width: 70 }
                       )
                       .text(
                           new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(detalle.precio)),
                           490,
                           yPosition,
                           { width: 70, align: 'right' }
                       );

                    yPosition += 20;
                });

                doc.moveDown(2);
                yPosition = doc.y;

                // RESUMEN DE PAGO
                doc.strokeColor('#000000')
                   .lineWidth(1)
                   .moveTo(350, yPosition)
                   .lineTo(562, yPosition)
                   .stroke();

                yPosition += 10;

                doc.fontSize(11)
                   .fillColor(secondaryColor)
                   .text('Total:', 370, yPosition)
                   .fillColor(textColor)
                   .text(
                       new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(venta.total)),
                       490,
                       yPosition,
                       { width: 70, align: 'right' }
                   );

                const totalPagado = Number(venta.total) - Number(venta.saldo_pendiente);
                yPosition += 20;

                doc.fillColor('#000000')
                   .text('Pagado:', 370, yPosition)
                   .fillColor('#000000')
                   .text(
                       new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(totalPagado),
                       490,
                       yPosition,
                       { width: 70, align: 'right' }
                   );

                yPosition += 20;

                doc.fillColor('#000000')
                   .text('Saldo Pendiente:', 370, yPosition)
                   .fillColor('#000000')
                   .text(
                       new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(venta.saldo_pendiente)),
                       490,
                       yPosition,
                       { width: 70, align: 'right' }
                   );

                // ESTADO DE PAGO
                yPosition += 30;
                doc.fontSize(10)
                   .fillColor('#000000')
                   .text(`Estado: ${venta.estado_pago}`, 370, yPosition, { align: 'right' });

                // HISTORIAL DE ABONOS si existen
                if (venta.abonos.length > 0) {
                    doc.moveDown(3);
                    
                    doc.fontSize(12)
                       .fillColor(textColor)
                       .text('Historial de Abonos', 50, doc.y, { underline: true })
                       .moveDown(0.5);

                    venta.abonos.forEach((abono, index) => {
                        doc.fontSize(9)
                           .fillColor('#000000')
                           .text(
                               `${new Date(abono.fecha_abono).toLocaleDateString('es-ES')} - ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(abono.abono))}`,
                               60,
                               doc.y
                           );
                        if (index < venta.abonos.length - 1) doc.moveDown(0.3);
                    });
                }

                // FOOTER
                doc.fontSize(8)
                   .fillColor('#000000')
                   .text(
                       'Gracias por su compra - Decortinas ERP',
                       50,
                       700,
                       { align: 'center', width: 512 }
                   );

                doc.end();

            } catch (error) {
                reject(error);
            }
        });
    }
}