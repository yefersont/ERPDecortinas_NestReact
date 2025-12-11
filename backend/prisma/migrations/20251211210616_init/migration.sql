-- CreateTable
CREATE TABLE "Clientes" (
    "idCliente" SERIAL NOT NULL,
    "cedula" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "telefono" TEXT,
    "direccion" TEXT,

    CONSTRAINT "Clientes_pkey" PRIMARY KEY ("idCliente")
);

-- CreateTable
CREATE TABLE "Tipo_producto" (
    "idTipo_producto" SERIAL NOT NULL,
    "nombre_tp" TEXT NOT NULL,

    CONSTRAINT "Tipo_producto_pkey" PRIMARY KEY ("idTipo_producto")
);

-- CreateTable
CREATE TABLE "Cotizaciones" (
    "idCotizacion" SERIAL NOT NULL,
    "idCliente" INTEGER NOT NULL,
    "idTipo_producto" INTEGER NOT NULL,
    "ancho" DECIMAL(65,30) NOT NULL,
    "alto" DECIMAL(65,30) NOT NULL,
    "mando" TEXT,
    "valor_total" DECIMAL(65,30) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cotizaciones_pkey" PRIMARY KEY ("idCotizacion")
);

-- CreateTable
CREATE TABLE "Ventas" (
    "idVenta" SERIAL NOT NULL,
    "fecha_venta" TIMESTAMP(3) NOT NULL,
    "idCotizacion" INTEGER NOT NULL,

    CONSTRAINT "Ventas_pkey" PRIMARY KEY ("idVenta")
);

-- CreateTable
CREATE TABLE "Deudores" (
    "idDeudor" SERIAL NOT NULL,
    "idCliente" INTEGER NOT NULL,
    "valor_venta" DECIMAL(65,30) NOT NULL,
    "abono" DECIMAL(65,30) NOT NULL,
    "fecha_abono" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deudores_pkey" PRIMARY KEY ("idDeudor")
);

-- CreateIndex
CREATE UNIQUE INDEX "Clientes_cedula_key" ON "Clientes"("cedula");

-- AddForeignKey
ALTER TABLE "Cotizaciones" ADD CONSTRAINT "Cotizaciones_idCliente_fkey" FOREIGN KEY ("idCliente") REFERENCES "Clientes"("idCliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cotizaciones" ADD CONSTRAINT "Cotizaciones_idTipo_producto_fkey" FOREIGN KEY ("idTipo_producto") REFERENCES "Tipo_producto"("idTipo_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ventas" ADD CONSTRAINT "Ventas_idCotizacion_fkey" FOREIGN KEY ("idCotizacion") REFERENCES "Cotizaciones"("idCotizacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deudores" ADD CONSTRAINT "Deudores_idCliente_fkey" FOREIGN KEY ("idCliente") REFERENCES "Clientes"("idCliente") ON DELETE RESTRICT ON UPDATE CASCADE;
