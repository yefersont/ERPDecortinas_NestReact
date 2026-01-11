import {Injectable} from '@nestjs/common';
import * as ExcelJS from 'exceljs';
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
}