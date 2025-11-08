# Etapa 1: Build
FROM node:18-alpine AS build

# Directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias ignorando conflictos de peer
RUN npm install --legacy-peer-deps

# Copiar el resto del proyecto
COPY . .

# Generar build de producción
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Copiar build generado a Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
