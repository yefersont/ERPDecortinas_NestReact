import { Injectable } from '@nestjs/common';
import { CreateCotizacioneDto } from './dto/create-cotizacione.dto';
import { UpdateCotizacioneDto } from './dto/update-cotizacione.dto';
import { PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class CotizacionesService {

 // Buscar todas las cotizaciones

  findAll() {
    return prisma.cotizaciones.findMany({
      include: {
        cliente: true,       
        tipoProducto: true,  
      },
    });
  }

 // Buscar una cotización

  findOne(id: number) {
    return prisma.cotizaciones.findUnique({
      where: {
        idCotizacion: id,
      },
      include: {
        cliente: true,       
        tipoProducto: true,  
      },
    });
  }

  // Crear una cotización

  async create(data: CreateCotizacioneDto) {
    return prisma.cotizaciones.create({
      data: {
        idCliente: data.idCliente,
        idTipo_producto: data.idTipo_producto,
        ancho: data.ancho,
        alto: data.alto,
        mando: data.mando,
        valor_total: data.valor_total,
        fecha: data.fecha,
      },
    });
  }

  update(id: number, updateCotizacioneDto: UpdateCotizacioneDto) {
    return `This action updates a #${id} cotizacione`;
  }

  remove(id: number) {
    return `This action removes a #${id} cotizacione`;
  }
}
