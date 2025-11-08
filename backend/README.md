# 🚀 Endorse Translate - Proyecto Completo

Sistema completo para transformar endosos de JSON plano a JSON estructurado, con backend en Node.js + Hapi y frontend en React.

## 📁 Estructura del Proyecto

```
Ejercicio 1/
├── backend/              # API en Node.js + Hapi
│   ├── src/
│   │   ├── routes/      # Definición de rutas
│   │   ├── controllers/  # Controladores
│   │   ├── services/    # Lógica de negocio
│   │   ├── repositories/# Acceso a datos
│   │   ├── models/      # Modelos de BD
│   │   ├── entities/    # DTOs
│   │   ├── mappers/     # Transformaciones
│   │   └── ...
│   ├── package.json
│   └── .env
│
├── frontend/            # Frontend en React
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── services/    # Servicios API
│   │   └── ...
│   ├── package.json
│   └── .env
│
├── docs/                # Documentación
├── GUIA_LOCAL.md        # Guía para ejecutar localmente
└── GUIA_GCP_GRATIS.md   # Guía para desplegar en GCP
```

## 🚀 Inicio Rápido

### Ejecutar Localmente

**Ver guía completa:** [GUIA_LOCAL.md](./GUIA_LOCAL.md)

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales
npm run migration:run
npm run dev

# 2. Frontend (en otra terminal)
cd frontend
npm install
npm start
```

### Desplegar en GCP

**Ver guía completa:** [GUIA_GCP_GRATIS.md](./GUIA_GCP_GRATIS.md)

## ✨ Características

- ✅ Arquitectura en capas (Routes, Controller, Service, Repository, Model, Entity, Mapper)
- ✅ Backend: Node.js + Hapi
- ✅ Frontend: React 18.2.0
- ✅ Base de datos: PostgreSQL
- ✅ Autenticación JWT
- ✅ Plantillas dinámicas configurables
- ✅ Pruebas unitarias
- ✅ Dockerizado
- ✅ Listo para GCP

## 📚 Documentación

- [Guía Local](./GUIA_LOCAL.md) - Ejecutar en tu máquina
- [Guía GCP](./GUIA_GCP_GRATIS.md) - Desplegar en GCP gratis
- [Arquitectura](./docs/ARCHITECTURE.md) - Diseño del sistema
- [Base de Datos](./docs/DATABASE.md) - Modelo de datos
- [Diagrama ER](./docs/DIAGRAM_ER.md) - Diagrama entidad-relación

## 🛠️ Tecnologías

### Backend
- Node.js 18+
- Hapi.js
- TypeORM
- PostgreSQL
- JWT
- Winston (Logging)

### Frontend
- React 18.2.0
- React Scripts
- Axios
- React JSON View

## 📝 Licencia

ISC


