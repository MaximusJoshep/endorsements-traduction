# 🚀 Guía Paso a Paso - Ejecución Local

Esta guía te ayudará a ejecutar el proyecto completo en tu ambiente local.

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.x ([Descargar](https://nodejs.org/))
- **npm** (viene con Node.js)
- **PostgreSQL** >= 15.x ([Descargar](https://www.postgresql.org/download/))
- **Docker Desktop** (opcional, para usar docker-compose) ([Descargar](https://www.docker.com/products/docker-desktop))

## 📁 Estructura del Proyecto

```
Ejercicio 1/
├── backend/          # API en Node.js + Hapi
│   ├── src/
│   ├── package.json
│   └── .env
└── frontend/         # Frontend en React
    ├── src/
    ├── package.json
    └── .env
```

## 🔧 Paso 1: Configurar Base de Datos

### Opción A: Usando Docker (Recomendado)

```bash
# Navegar a la carpeta backend
cd backend

# Iniciar PostgreSQL con Docker Compose
docker-compose up -d db

# Verificar que el contenedor está corriendo
docker ps
```

### Opción B: PostgreSQL Local

1. Instala PostgreSQL en tu máquina
2. Crea una base de datos:
```sql
CREATE DATABASE endorse_db;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE endorse_db TO postgres;
```

## 🔧 Paso 2: Configurar Backend

```bash
# Navegar a la carpeta backend
cd backend

# Instalar dependencias
npm install

# Copiar archivo de ejemplo de variables de entorno
# En Windows PowerShell:
Copy-Item .env.example .env

# En Linux/Mac:
# cp .env.example .env

# Editar el archivo .env con tus credenciales
# Abre .env y verifica/ajusta:
# - DB_HOST=localhost
# - DB_PORT=5432
# - DB_USERNAME=postgres
# - DB_PASSWORD=postgres
# - DB_DATABASE=endorse_db
# - JWT_SECRET=tu-secret-key-aqui
```

## 🔧 Paso 3: Inicializar Base de Datos

```bash
# Asegúrate de estar en la carpeta backend
cd backend

# Ejecutar migraciones para crear las tablas
npx typeorm migration:run -d ./src/config/database.js

# Verificar que las tablas se crearon correctamente
# (Opcional) Conectarte a PostgreSQL y verificar:
# psql -U postgres -d endorse_db
# \dt
# SELECT * FROM templates;
```

## 🔧 Paso 4: Iniciar Backend

```bash
# Asegúrate de estar en la carpeta backend
cd backend

# Modo desarrollo (con auto-reload)
npm run dev

# O modo producción
npm start
```

**Verifica que el backend está corriendo:**
- Abre tu navegador en: `http://localhost:3000/health`
- Deberías ver: `{"status":"ok","timestamp":"..."}`

**Verifica el endpoint de info:**
- Abre: `http://localhost:3000/v1/info`
- Deberías ver información del API

## 🔧 Paso 5: Configurar Frontend

Abre una **nueva terminal** (deja el backend corriendo):

```bash
# Navegar a la carpeta frontend
cd frontend

# Instalar dependencias
npm install

# Crear archivo .env (opcional, tiene valores por defecto)
# El frontend está configurado para usar http://localhost:3000 por defecto
```

## 🔧 Paso 6: Iniciar Frontend

```bash
# Asegúrate de estar en la carpeta frontend
cd frontend

# Iniciar aplicación React
npm start
```

El frontend se abrirá automáticamente en: `http://localhost:3000` (o el siguiente puerto disponible)

**Nota:** Si el puerto 3000 está ocupado por el backend, React usará el puerto 3001 automáticamente.

## ✅ Paso 7: Probar la Aplicación

### 1. Obtener Token JWT

**Opción A: Desde el Frontend**
- El frontend tiene un formulario de login
- Usa cualquier usuario y contraseña (ej: `test` / `test`)

**Opción B: Desde Postman/curl**

```bash
# Obtener token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'

# Guarda el token que recibes en la respuesta
```

### 2. Probar el Endpoint de Traducción

**Desde el Frontend:**
1. Completa el formulario con los datos de ejemplo
2. Haz clic en "🔄 Traducir Endoso"
3. Verás el JSON estructurado en el panel derecho

**Desde Postman/curl:**

```bash
# Reemplaza YOUR_TOKEN con el token obtenido
curl -X POST http://localhost:3000/v1/endorse/translate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "policyNumber": "08200000049",
    "idEnvio": 5984,
    "frecuencia": "Semestral",
    "tipoEndoso": "CambioFrecuencia",
    "producto": "Rumbo",
    "plan": "PlanRumbo",
    "moneda": "Nuevo Sol",
    "usuario": "interface.servicios",
    "fechaSolicitud": "2025-08-27",
    "fechaCliente": "2025-08-27",
    "fechaEfectiva": "2025-09-01"
  }'
```

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"

**Solución:**
1. Verifica que PostgreSQL está corriendo:
   ```bash
   # Con Docker:
   docker ps
   
   # O verifica el servicio de PostgreSQL
   ```
2. Verifica las credenciales en `backend/.env`
3. Prueba conectarte manualmente:
   ```bash
   psql -U postgres -d endorse_db
   ```

### Error: "Template not found"

**Solución:**
1. Verifica que las migraciones se ejecutaron:
   ```bash
   cd backend
   npm run migration:run
   ```
2. Verifica que hay datos en la tabla:
   ```sql
   SELECT * FROM templates;
   ```

### Error: "Port 3000 already in use"

**Solución:**
- El frontend automáticamente usará el puerto 3001
- O cambia el puerto del backend en `backend/.env`: `PORT=3001`

### Error: CORS en el frontend

**Solución:**
- El backend ya tiene CORS configurado
- Verifica que el backend está corriendo en `http://localhost:3000`
- Verifica la URL en `frontend/src/services/api.js`

## 📝 Comandos Útiles

```bash
# Ver logs del backend
cd backend
npm run dev

# Ver logs de la base de datos (Docker)
docker-compose logs -f db

# Reiniciar base de datos
docker-compose restart db

# Detener todo
docker-compose down

# Ejecutar pruebas
cd backend
npm test

# Limpiar node_modules (si hay problemas)
rm -rf node_modules package-lock.json
npm install
```

## 🎯 Verificación Final

✅ Backend corriendo en `http://localhost:3000`  
✅ Frontend corriendo en `http://localhost:3000` (o 3001)  
✅ Base de datos conectada  
✅ Puedes hacer login y obtener token  
✅ Puedes traducir un endoso desde el frontend  

¡Listo! Tu aplicación está corriendo localmente. 🎉

