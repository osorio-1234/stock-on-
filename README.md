# Stock On — versión de trabajo Node.js + MongoDB

Esta versión conserva las páginas HTML/CSS/JS del proyecto y separa el backend en Node.js, Express y MongoDB.

## Requisitos
- Node.js 20 o superior y npm.
- MongoDB local o una base MongoDB Atlas.
- Extensión Live Server (o servidor estático equivalente) para el frontend.

## 1. Configurar el backend
```bash
cd backend
npm install
cp .env.example .env
```
Edita `backend/.env`: configura `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, `ADMIN_USER` y `ADMIN_PASSWORD`. Usa una clave JWT larga y única. No subas `.env` a GitHub.

## 2. Crear datos iniciales
```bash
npm run seed
```
El seed crea productos de demostración y el administrador definido en `.env`. No ejecutarlo repetidamente en una base con datos reales: reemplaza el catálogo de productos.

## 3. Iniciar API
```bash
npm run dev
```
API: `http://localhost:3000` · Salud: `http://localhost:3000/api/health`

## 4. Abrir frontend
Abre la carpeta raíz con VS Code y ejecuta Live Server desde `login.html` (normalmente `http://127.0.0.1:5500/login.html`). Si Live Server usa otro puerto, actualiza `FRONTEND_URL` en `.env` y reinicia la API.

## Funciones incluidas en el código
- Registro e inicio de sesión con contraseñas cifradas y JWT.
- Catálogo servido desde MongoDB.
- Favoritos persistidos por usuario.
- Formulario de contacto guardado en MongoDB.
- Panel `/admin/index.html` con control de rol y CRUD de productos.
- Bandeja de mensajes de contacto para administración.
- Nico responde usando productos y países existentes en el catálogo.

## Endpoints principales
- `POST /api/registro`, `POST /api/login`, `GET /api/me`
- `GET /api/productos`, `POST /api/favoritos`
- `POST /api/contacto`, `POST /api/nico`
- `GET /api/admin/resumen`, `GET /api/admin/contacto`
- `POST /api/admin/productos`, `PUT /api/admin/productos/:id`, `DELETE /api/admin/productos/:id`

## Importante antes de presentar
Este paquete es una base de trabajo preparada, **no una certificación de que todo ya funciona**. Hay que instalar dependencias, conectar MongoDB, ejecutar el seed y probar cada flujo en el equipo donde se presentará. El frontend conserva partes de la versión anterior; revisa especialmente navegación, acceso a páginas y experiencia en móvil.
