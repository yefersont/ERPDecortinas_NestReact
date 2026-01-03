# ERP Decortinas

Sistema de gestión empresarial (ERP) desarrollado para la administración de cortinas y decoración, compuesto por un sistema backend robusto y una interfaz frontend moderna.

## Tecnologías

El proyecto está dividido en dos partes principales:

### Backend
- **Framework:** [NestJS](https://nestjs.com/)
- **Lenguaje:** TypeScript
- **Base de Datos (ORM):** [Prisma](https://www.prisma.io/)
- **Autenticación:** JWT & Passport
- **Utilidades:** Class Validator, Bcrypt

### Frontend
- **Framework:** [React](https://react.dev/) (v19)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Estilos:** [TailwindCSS](https://tailwindcss.com/)
- **Enrutamiento:** React Router Dom
- **Iconos:** Lucide React
- **Gráficos:** Recharts

## Estructura del Proyecto

```
/
├── backend/            # Código fuente del servidor API
│   ├── src/
│   ├── prisma/        # Esquemas y migraciones de base de datos
│   └── test/
└── frontend/           # Código fuente de la interfaz de usuario
    ├── src/
    └── public/
```

## Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior recomendado)
- Base de datos compatible con Prisma (MySQL/PostgreSQL)

### 1. Configuración del Backend

Navega al directorio del backend e instala las dependencias:

```bash
cd backend
npm install
```

Configura tus variables de entorno creando un archivo `.env` en la carpeta `backend` (basado en el ejemplo si existe, o configurando `DATABASE_URL` y claves JWT).

Ejecuta las migraciones de base de datos y el seed (si aplica):

```bash
npx prisma migrate dev
npm run seed
```

Inicia el servidor de desarrollo:

```bash
npm run start:dev
```
El backend correrá generalmente en `http://localhost:3000`.

### 2. Configuración del Frontend

En una nueva terminal, navega al directorio del frontend e instala las dependencias:

```bash
cd frontend
npm install
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```
El frontend estará disponible generalmente en `http://localhost:5173`.

## Características Principales

- **Gestión de Clientes:** Administración completa de información de clientes.
- **Cotizaciones:** Creación de cotizaciones con selección de clientes y detalles de productos.
- **Ventas:** Registro y seguimiento de ventas.
- **Interfaz Moderna:** Diseño responsive y modo oscuro implementado con TailwindCSS.
- **Reportes:** Visualización de datos y métricas clave.

## Contribución

1. Haz un Fork del proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Haz Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---
Desarrollado por Tellzar - 2026
