/*
  Warnings:

  - Added the required column `saldo_pendiente` to the `Ventas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Ventas` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'PAGADO');

-- AlterTable
ALTER TABLE "Ventas" ADD COLUMN     "estado_pago" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
ADD COLUMN     "saldo_pendiente" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "total" DECIMAL(65,30) NOT NULL;
