import { Controller, Get, UseGuards } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notificaciones')
export class NotificacionesController {
  constructor(
    private readonly notificacionesService: NotificacionesService,
  ) { }

  @Get()
  @Roles('ADMIN', 'USER')
  async obtenerNotificaciones() {
    return {
      message: "Clientes con mora superior a 30 días",
      data: await this.notificacionesService.obtenerNotificaciones(),
    };
  }
}