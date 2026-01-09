import {Injectable} from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExportService {
    constructor(private readonly prisma: PrismaService) {}

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
        hoja.getRow(1).font = { bold: true };
        hoja.getColumn('valorTotal').numFmt = '"$"#,##0';
        hoja.getColumn('totalVenta').numFmt = '"$"#,##0';
        hoja.getColumn('saldoPendiente').numFmt = '"$"#,##0';
        hoja.getColumn('fecha').numFmt = 'dd/mm/yyyy';
        return libro;

    }
}