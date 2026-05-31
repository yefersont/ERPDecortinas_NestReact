import {
    Controller,
    Get,
    Res,
    Param,
    UseGuards,
} from "@nestjs/common";
import type { Response } from "express";
import { ExportService } from "./export.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('exports')
export class ExportController {
    constructor(private readonly exportService: ExportService) { }

    @Get('cotizacionesToExcel')
    @Roles('ADMIN', 'USER')
    async exportCotizacionesToExcel(@Res() res: Response) {
        const workbook = await this.exportService.exportCotizacionesToExcel();
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename="cotizaciones.xlsx"',
        );
        await workbook.xlsx.write(res);
        res.end();
    }

    @Get('ventasToExcel')
    @Roles('ADMIN', 'USER')
    async exportVentasToExcel(@Res() res: Response) {
        const workbook = await this.exportService.exportVentasToExcel();
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename="ventas.xlsx"',
        );
        await workbook.xlsx.write(res);
        res.end();
    }

    @Get('ventaFacturaPDF/:id')
    @Roles('ADMIN', 'USER')
    async exportVentaFacturaPDF(
        @Param('id') id: string,
        @Res() res: Response,
    ) {
        try {
            const pdfBuffer = await this.exportService.exportVentaFacturaPDF(+id);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="factura-${id}.pdf"`,
            );

            res.send(pdfBuffer);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    @Get('clientesToExcel')
    @Roles('ADMIN')
    async exportClientesToExcel(@Res() res: Response) {
        const workbook = await this.exportService.exportClientesToExcel();

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename="clientes.xlsx"',
        );

        await workbook.xlsx.write(res);
        res.end();
    }
}