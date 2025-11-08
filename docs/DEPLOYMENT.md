# Guía de Despliegue en GCP

## Prerrequisitos

1. Cuenta de GCP con proyecto creado
2. Google Cloud SDK instalado y configurado
3. Docker instalado (para pruebas locales)

## Opción 1: Cloud Run (Recomendado)

### 1. Habilitar APIs necesarias

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 2. Crear instancia de Cloud SQL (PostgreSQL)

```bash
# Crear instancia
gcloud sql instances create endorse-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password=YOUR_SECURE_PASSWORD

# Crear base de datos
gcloud sql databases create endorse_db \
  --instance=endorse-db

# Crear usuario
gcloud sql users create endorse_user \
  --instance=endorse-db \
  --password=YOUR_USER_PASSWORD
```

### 3. Configurar Cloud Build

```bash
# Configurar proyecto
gcloud config set project YOUR_PROJECT_ID

# Enviar build
gcloud builds submit --config cloudbuild.yaml
```

### 4. Desplegar en Cloud Run

```bash
# Desplegar servicio
gcloud run deploy endorse-api \
  --image gcr.io/YOUR_PROJECT_ID/endorse-api:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="DB_HOST=/cloudsql/YOUR_PROJECT_ID:us-central1:endorse-db,DB_PORT=5432,DB_USERNAME=endorse_user,DB_PASSWORD=YOUR_USER_PASSWORD,DB_DATABASE=endorse_db,JWT_SECRET=YOUR_JWT_SECRET,NODE_ENV=production,API_VERSION=v1" \
  --add-cloudsql-instances=YOUR_PROJECT_ID:us-central1:endorse-db \
  --memory=512Mi \
  --cpu=1 \
  --timeout=300 \
  --max-instances=10
```

### 5. Ejecutar migraciones

```bash
# Conectar a la instancia
gcloud sql connect endorse-db --user=endorse_user

# Ejecutar migraciones manualmente o crear un job temporal
```

## Opción 2: Compute Engine con Docker

### 1. Crear instancia VM

```bash
gcloud compute instances create endorse-api-vm \
  --zone=us-central1-a \
  --machine-type=e2-micro \
  --image-family=cos-stable \
  --image-project=cos-cloud \
  --boot-disk-size=10GB
```

### 2. Instalar Docker en la VM

```bash
gcloud compute ssh endorse-api-vm --zone=us-central1-a

# En la VM
sudo systemctl start docker
```

### 3. Desplegar aplicación

```bash
# Copiar archivos
gcloud compute scp --recurse . endorse-api-vm:~/app --zone=us-central1-a

# En la VM
cd ~/app
docker-compose up -d
```

## Opción 3: GKE (Google Kubernetes Engine)

### 1. Crear cluster

```bash
gcloud container clusters create endorse-cluster \
  --num-nodes=2 \
  --zone=us-central1-a \
  --machine-type=e2-micro
```

### 2. Construir y subir imagen

```bash
# Construir
docker build -t gcr.io/YOUR_PROJECT_ID/endorse-api .

# Subir
docker push gcr.io/YOUR_PROJECT_ID/endorse-api
```

### 3. Crear deployment

```bash
kubectl create deployment endorse-api \
  --image=gcr.io/YOUR_PROJECT_ID/endorse-api

kubectl expose deployment endorse-api \
  --type=LoadBalancer \
  --port=80 \
  --target-port=3000
```

## Configuración de Variables de Entorno

### Cloud Run

Usar `--set-env-vars` o Cloud Console → Cloud Run → Variables de entorno

### Secrets Manager (Recomendado para producción)

```bash
# Crear secretos
echo -n "YOUR_DB_PASSWORD" | gcloud secrets create db-password --data-file=-
echo -n "YOUR_JWT_SECRET" | gcloud secrets create jwt-secret --data-file=-

# Usar en Cloud Run
gcloud run services update endorse-api \
  --update-secrets=DB_PASSWORD=db-password:latest,JWT_SECRET=jwt-secret:latest
```

## Configuración de Dominio Personalizado

```bash
# Mapear dominio
gcloud run domain-mappings create \
  --service endorse-api \
  --domain api.tudominio.com \
  --region us-central1
```

## Monitoreo y Logging

### Cloud Logging

Los logs se capturan automáticamente. Ver en:
- Cloud Console → Logging → Cloud Run

### Cloud Monitoring

```bash
# Habilitar monitoring
gcloud services enable monitoring.googleapis.com
```

## Escalado Automático

Cloud Run escala automáticamente basado en:
- Número de requests
- CPU y memoria
- Configurado en `--max-instances` y `--min-instances`

## Costos Estimados (Capa Gratuita)

### Cloud Run
- 2 millones de requests gratis/mes
- 360,000 GB-segundos gratis/mes
- 180,000 vCPU-segundos gratis/mes

### Cloud SQL
- db-f1-micro: ~$7.67/mes (no está en capa gratuita)
- Alternativa: usar Cloud SQL con tier mínimo o PostgreSQL en Compute Engine

### Recomendación para Capa Gratuita

1. Usar Cloud Run para el API (gratis hasta límites)
2. Usar PostgreSQL en Compute Engine (e2-micro) para BD
3. Usar Cloud Storage para assets estáticos

## Troubleshooting

### Error de conexión a BD

```bash
# Verificar conexión
gcloud sql connect endorse-db --user=endorse_user

# Verificar firewall
gcloud sql instances describe endorse-db
```

### Ver logs

```bash
# Cloud Run logs
gcloud run services logs read endorse-api --limit=50

# Cloud Build logs
gcloud builds list --limit=10
```

### Reiniciar servicio

```bash
gcloud run services update endorse-api --region=us-central1
```

## CI/CD con Cloud Build

El archivo `cloudbuild.yaml` está configurado para:
1. Construir imagen Docker
2. Subir a Container Registry
3. Desplegar en Cloud Run

Para automatizar:

```bash
# Crear trigger
gcloud builds triggers create github \
  --repo-name=YOUR_REPO \
  --repo-owner=YOUR_USERNAME \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```



