# ☁️ Guía Paso a Paso - Despliegue en GCP (Capa Gratuita)

Esta guía te ayudará a desplegar tu aplicación en Google Cloud Platform usando servicios de la capa gratuita.

## 📋 Prerrequisitos

1. **Cuenta de Google Cloud Platform** ([Crear cuenta](https://cloud.google.com/))
   - GCP ofrece $300 de crédito gratis por 90 días
   - Después, muchos servicios tienen capa gratuita permanente

2. **Google Cloud SDK (gcloud)** instalado ([Instalar](https://cloud.google.com/sdk/docs/install))
   ```bash
   # Verificar instalación
   gcloud --version
   ```

3. **Docker** instalado (para construir imágenes)

## 🎯 Estrategia para Capa Gratuita

Para mantener los costos en $0, usaremos:

- ✅ **Cloud Run** - 2 millones de requests gratis/mes
- ✅ **Cloud SQL (PostgreSQL)** - db-f1-micro (no es gratis, pero muy económico ~$7/mes)
- ✅ **Alternativa GRATIS**: PostgreSQL en Compute Engine (e2-micro) - **GRATIS siempre**

**Recomendación:** Usaremos PostgreSQL en Compute Engine para mantener todo gratis.

## 🔧 Paso 1: Configurar Proyecto en GCP

```bash
# 1. Iniciar sesión en GCP
gcloud auth login

# 2. Crear un nuevo proyecto (o usar existente)
gcloud projects create  --name="Endorse Translate"

# 3. Configurar proyecto actual
gcloud config set project tu-proyecto-id

# 4. Habilitar facturación (necesario aunque uses capa gratuita)
# Ve a: https://console.cloud.google.com/billing
# Crea una cuenta de facturación y asóciala al proyecto
```

## 🔧 Paso 2: Habilitar APIs Necesarias

```bash
# Habilitar APIs requeridas
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable compute.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

## 🔧 Paso 3: Crear Base de Datos PostgreSQL (GRATIS)

### Opción A: Compute Engine (GRATIS - Recomendado)

```bash
# 1. Crear instancia VM e2-micro (GRATIS siempre)
gcloud compute instances create endorse-db \
  --zone=us-central1-a \
  --machine-type=e2-micro \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=10GB \
  --boot-disk-type=pd-standard

# 2. Abrir puerto 5432 en el firewall
gcloud compute firewall-rules create allow-postgres \
  --allow tcp:5432 \
  --source-ranges 0.0.0.0/0 \
  --description "Allow PostgreSQL"

# 3. Conectarte a la VM
gcloud compute ssh endorse-db --zone=us-central1-a

# 4. Dentro de la VM, instalar PostgreSQL
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# 5. Configurar PostgreSQL
sudo -u postgres psql << EOF
ALTER USER postgres WITH PASSWORD 'admin';
CREATE DATABASE endorse_db;
GRANT ALL PRIVILEGES ON DATABASE endorse_db TO postgres;
\q
EOF

# 6. Configurar PostgreSQL para aceptar conexiones externas
sudo nano /etc/postgresql/14/main/postgresql.conf
# Buscar: #listen_addresses = 'localhost'
# Cambiar a: listen_addresses = '*'

sudo nano /etc/postgresql/14/main/pg_hba.conf
# Agregar al final:
# host    all             all             0.0.0.0/0               md5

# 7. Reiniciar PostgreSQL
sudo systemctl restart postgresql

# 8. Salir de la VM
exit
```

**Obtén la IP externa de la VM:**
```bash
gcloud compute instances describe endorse-db --zone=us-central1-a --format='get(networkInterfaces[0].accessConfigs[0].natIP)'
```

### Opción B: Cloud SQL (No gratis, pero muy económico)

Si prefieres usar Cloud SQL (más fácil de gestionar):

```bash
# Crear instancia Cloud SQL (db-f1-micro ~$7/mes)
gcloud sql instances create endorse-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password=TU_PASSWORD_SEGURO

# Crear base de datos
gcloud sql databases create endorse_db --instance=endorse-db

# Obtener IP de conexión
gcloud sql instances describe endorse-db --format='get(ipAddresses[0].ipAddress)'
```

## 🔧 Paso 4: Preparar Backend para Despliegue

```bash
# Navegar a la carpeta backend
cd backend

# 1. Actualizar cloudbuild.yaml con tu PROJECT_ID
# Edita cloudbuild.yaml y reemplaza $PROJECT_ID si es necesario
# (gcloud lo reemplazará automáticamente)

# 2. Verificar que Dockerfile está correcto
# (Ya está configurado)
```

## 🔧 Paso 5: Configurar Variables de Entorno

Crea un archivo `backend/.env.production` o usa Cloud Run Secrets:

```bash
# Obtén la IP de tu base de datos
DB_IP=$(gcloud compute instances describe endorse-db --zone=us-central1-a --format='get(networkInterfaces[0].accessConfigs[0].natIP)')

# Variables que necesitarás:
# DB_HOST=<IP_DE_LA_VM>
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=<TU_PASSWORD>
# DB_DATABASE=endorse_db
# JWT_SECRET=<GENERA_UN_SECRET_SEGURO>
```

## 🔧 Paso 6: Desplegar Backend en Cloud Run

```bash
# Asegúrate de estar en la carpeta backend
cd backend

# 1. Construir y desplegar con Cloud Build
gcloud builds submit --config cloudbuild.yaml

# 2. O manualmente:

# Construir imagen
gcloud builds submit --tag gcr.io/tu-proyecto-id/endorse-api

# Desplegar en Cloud Run
gcloud run deploy endorse-api \
  --image gcr.io/tu-proyecto-id/endorse-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="DB_HOST=TU_IP_DB,DB_PORT=5432,DB_USERNAME=postgres,DB_PASSWORD=TU_PASSWORD,DB_DATABASE=endorse_db,JWT_SECRET=TU_JWT_SECRET,NODE_ENV=production,API_VERSION=v1" \
  --memory=512Mi \
  --cpu=1 \
  --timeout=300 \
  --max-instances=10

# 3. Obtener URL del servicio
gcloud run services describe endorse-api --region us-central1 --format='get(status.url)'
```

## 🔧 Paso 7: Ejecutar Migraciones en la Base de Datos

```bash
# Opción A: Desde tu máquina local
cd backend

# Configurar .env con las credenciales de GCP
# DB_HOST=<IP_DE_LA_VM>
# DB_PORT=5432
# ... etc

# Ejecutar migraciones
npm run migration:run

# Opción B: Desde la VM directamente
gcloud compute ssh endorse-db --zone=us-central1-a
# Luego ejecutar los comandos SQL manualmente
```

## 🔧 Paso 8: Desplegar Frontend

### Opción A: Cloud Run (Recomendado)

```bash
cd frontend

# 1. Crear Dockerfile para el frontend
cat > Dockerfile << 'EOF'
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# 2. Crear nginx.conf
cat > nginx.conf << 'EOF'
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
EOF

# 3. Actualizar api.js con la URL de Cloud Run
# Edita frontend/src/services/api.js
# Cambia: const API_BASE_URL = 'https://tu-cloud-run-url.run.app/v1'

# 4. Construir y desplegar
gcloud builds submit --tag gcr.io/tu-proyecto-id/endorse-frontend

gcloud run deploy endorse-frontend \
  --image gcr.io/endorse-translate/endorse-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port=80
```

### Opción B: Firebase Hosting (GRATIS - Más fácil)

```bash
cd frontend

# 1. Instalar Firebase CLI
npm install -g firebase-tools

# 2. Iniciar sesión
firebase login

# 3. Inicializar proyecto
firebase init hosting

# 4. Configurar:
# - Public directory: build
# - Single-page app: Yes
# - GitHub deploys: No

# 5. Actualizar api.js con la URL de Cloud Run del backend

# 6. Construir
npm run build

# 7. Desplegar
firebase deploy --only hosting
```

## 🔧 Paso 9: Configurar CORS

Asegúrate de que el backend permita requests desde tu frontend:

```javascript
// backend/src/server.js ya tiene CORS configurado
// Pero verifica que incluye el dominio de tu frontend
cors: {
  origin: ['*'], // En producción, especifica tu dominio
  ...
}
```

## 🔧 Paso 10: Verificar Despliegue

```bash
# 1. Verificar backend
curl https://tu-backend-url.run.app/health

# 2. Obtener token (usa CUALQUIER usuario y contraseña)
curl -X POST https://tu-backend-url.run.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'

# 3. Probar endpoint
curl -X POST https://tu-backend-url.run.app/v1/endorse/translate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{...}'
```

## 🔐 Credenciales de Login

**IMPORTANTE:** El sistema acepta **CUALQUIER usuario y contraseña** para el login.

### Ejemplos de credenciales válidas:
- Usuario: `test` / Contraseña: `test`
- Usuario: `admin` / Contraseña: `admin`
- Usuario: `usuario1` / Contraseña: `123456`
- **Cualquier combinación de usuario y contraseña funcionará**

### ⚠️ Nota de Seguridad:
Este es un sistema de autenticación simplificado para desarrollo/demostración. En producción real, deberías:
1. Implementar validación de usuarios en base de datos
2. Usar hash de contraseñas (bcrypt, argon2)
3. Implementar rate limiting
4. Usar OAuth2 o similar para autenticación robusta

## 💰 Costos Estimados (Capa Gratuita)

### Con Compute Engine para BD:

- ✅ **Cloud Run**: 2M requests/mes GRATIS
- ✅ **Compute Engine e2-micro**: GRATIS siempre (hasta 1 instancia)
- ✅ **Firebase Hosting**: GRATIS (10GB storage, 360MB/day transfer)
- ✅ **Cloud Build**: 120 minutos/día GRATIS
- ✅ **Container Registry**: 0.5GB storage GRATIS

**Total: $0/mes** 🎉

### Con Cloud SQL:

- ✅ **Cloud Run**: GRATIS
- ⚠️ **Cloud SQL db-f1-micro**: ~$7/mes
- ✅ **Firebase Hosting**: GRATIS

**Total: ~$7/mes**

## 🐛 Solución de Problemas

### Error: "Connection refused" desde Cloud Run

**Solución:**
1. Verifica que el firewall permite conexiones desde Cloud Run
2. Cloud Run usa IPs dinámicas, permite `0.0.0.0/0` temporalmente
3. Mejor: Usa Cloud SQL con conexión privada

### Error: "Database does not exist"

**Solución:**
```bash
# Conectarte a la VM y crear la BD
gcloud compute ssh endorse-db --zone=us-central1-a
sudo -u postgres psql
CREATE DATABASE endorse_db;
```

### Error: Timeout en Cloud Run

**Solución:**
```bash
# Aumentar timeout
gcloud run services update endorse-api \
  --timeout=300 \
  --region us-central1
```

## 📝 Comandos Útiles

```bash
# Ver logs de Cloud Run
gcloud run services logs read endorse-api --region us-central1

# Ver logs de la VM
gcloud compute ssh endorse-db --zone=us-central1-a --command "sudo tail -f /var/log/postgresql/postgresql-14-main.log"

# Reiniciar Cloud Run
gcloud run services update endorse-api --region us-central1

# Ver costos
gcloud billing accounts list
```

## ✅ Checklist Final

- [ ] Proyecto GCP creado
- [ ] APIs habilitadas
- [ ] Base de datos PostgreSQL creada y configurada
- [ ] Migraciones ejecutadas
- [ ] Backend desplegado en Cloud Run
- [ ] Frontend desplegado (Cloud Run o Firebase)
- [ ] CORS configurado
- [ ] Variables de entorno configuradas
- [ ] Aplicación funcionando end-to-end

¡Tu aplicación está desplegada en GCP! 🚀

