import { Controller, Get, Res } from "@nestjs/common";
import type { Response } from "express";
import { ExportService } from "./export.service";


@Controller('exports')
export class ExportController {
    constructor(private readonly exportService: ExportService) {}

    @Get('cotizacionesToExcel')
    async exportCotizacionesToExcel(@Res() res: Response) {
        const workbook = await this.exportService.exportCotizacionesToExcel();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="cotizaciones.xlsx"');
        await workbook.xlsx.write(res);
        res.end();
    }
}
