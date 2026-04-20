/*
  Warnings:

  - Added the required column `costo_calculado` to the `DetalleCotizacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DetalleCotizacion" ADD COLUMN     "costo_calculado" DECIMAL(65,30) NOT NULL;

-- CreateTable
CREATE TABLE "CostoTipoProducto" (
    "idCosto" SERIAL NOT NULL,
    "idTipo_producto" INTEGER NOT NULL,
    "costo_base" DECIMAL(65,30) NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3),

    CONSTRAINT "CostoTipoProducto_pkey" PRIMARY KEY ("idCosto")
);

-- CreateIndex
CREATE INDEX "CostoTipoProducto_idTipo_producto_fecha_inicio_fecha_fin_idx" ON "CostoTipoProducto"("idTipo_producto", "fecha_inicio", "fecha_fin");

-- AddForeignKey
ALTER TABLE "CostoTipoProducto" ADD CONSTRAINT "CostoTipoProducto_idTipo_producto_fkey" FOREIGN KEY ("idTipo_producto") REFERENCES "Tipo_producto"("idTipo_producto") ON DELETE RESTRICT ON UPDATE CASCADE;
