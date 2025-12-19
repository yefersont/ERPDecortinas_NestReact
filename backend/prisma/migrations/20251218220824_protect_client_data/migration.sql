/*
  Warnings:

  - You are about to drop the column `cedula` on the `Clientes` table. All the data in the column will be lost.
  - You are about to drop the column `direccion` on the `Clientes` table. All the data in the column will be lost.
  - You are about to drop the column `telefono` on the `Clientes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cedula_hash]` on the table `Clientes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cedula_enc` to the `Clientes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cedula_hash` to the `Clientes` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Clientes_cedula_key";

-- AlterTable
ALTER TABLE "Clientes" DROP COLUMN "cedula",
DROP COLUMN "direccion",
DROP COLUMN "telefono",
ADD COLUMN     "cedula_enc" JSONB NOT NULL,
ADD COLUMN     "cedula_hash" TEXT NOT NULL,
ADD COLUMN     "direccion_enc" JSONB,
ADD COLUMN     "telefono_enc" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "Clientes_cedula_hash_key" ON "Clientes"("cedula_hash");
