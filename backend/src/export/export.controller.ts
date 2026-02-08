import { Controller, Get, Res, Param } from "@nestjs/common";
import type { Response } from "express";
import { ExportService } from "./export.service";


@Controller('exports')
export class ExportController {
    constructor(private readonly exportService: ExportService) { }

    @Get('cotizacionesToExcel')
    async exportCotizacionesToExcel(@Res() res: Response) {
        const workbook = await this.exportService.exportCotizacionesToExcel();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="cotizaciones.xlsx"');
        await workbook.xlsx.write(res);
        res.end();
    }

    @Get('ventasToExcel')
    async exportVentasToExcel(@Res() res: Response) {
        const workbook = await this.exportService.exportVentasToExcel();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="ventas.xlsx"');
        await workbook.xlsx.write(res);
        res.end();
    }


    @Get('ventaFacturaPDF/:id')
    async exportVentaFacturaPDF(@Param('id') id: string, @Res() res: Response) {
        try {
            const pdfBuffer = await this.exportService.exportVentaFacturaPDF(+id);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="factura-${id}.pdf"`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    @Get('clientesToExcel')
    async exportClientesToExcel(@Res() res: Response) {
        const workbook = await this.exportService.exportClientesToExcel();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="clientes.xlsx"');
        await workbook.xlsx.write(res);
        res.end();
    }
}
