# Arquitectura del Sistema

## Diagrama de Arquitectura en Capas

```
┌─────────────────────────────────────────────────────────────┐
│                        ROUTES                                │
│              (Endpoints HTTP - Punto de entrada)              │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                      CONTROLLER                             │
│        (Recibe requests, valida, llama a Service)            │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                       SERVICE                                │
│              (Lógica de negocio principal)                   │
└───────┬───────────────┬───────────────┬─────────────────────┘
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ REPOSITORY   │ │ INTEGRATION  │ │  PUBLISHER   │
│ (Persistencia│ │ (APIs Ext)   │ │ (Mensajería) │
└──────┬───────┘ └──────────────┘ └──────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                        MODEL                                 │
│          (Estructura de datos en BD - TypeORM)              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        ENTITY                                │
│              (DTOs - Usados en Controller/Service)           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        MAPPER                                │
│     (Transforma entre Entity y Model - Usado en Service)    │
└─────────────────────────────────────────────────────────────┘
```

## Flujo de Datos

### 1. Request HTTP
```
Cliente → ROUTES → CONTROLLER
```

### 2. Procesamiento
```
CONTROLLER → SERVICE
  ↓
SERVICE → MAPPER (JSON plano → Entity)
  ↓
SERVICE → REPOSITORY → MODEL (BD)
  ↓
SERVICE → MAPPER (Entity + Model → Entity respuesta)
  ↓
SERVICE → CONTROLLER
```

### 3. Response HTTP
```
CONTROLLER → ROUTES → Cliente
```

## Principios SOLID Aplicados

### Single Responsibility Principle (SRP)
- Cada capa tiene una responsabilidad única:
  - Routes: Enrutamiento
  - Controller: Validación y coordinación
  - Service: Lógica de negocio
  - Repository: Acceso a datos
  - Mapper: Transformación

### Open/Closed Principle (OCP)
- El sistema es extensible sin modificar código:
  - Nuevas plantillas se agregan solo en BD
  - No se requiere cambiar código para nuevos productos/tipos

### Liskov Substitution Principle (LSP)
- Las interfaces entre capas son consistentes
- Repository puede ser intercambiado sin afectar Service

### Interface Segregation Principle (ISP)
- Cada capa expone solo lo necesario
- Service no expone detalles de Repository

### Dependency Inversion Principle (DIP)
- Service depende de abstracciones (Repository)
- No depende directamente de implementaciones concretas

## Comunicación entre Capas

### ROUTES ↔ CONTROLLER
- Routes recibe HTTP requests
- Llama a métodos del Controller
- Controller retorna respuestas HTTP

### CONTROLLER ↔ SERVICE
- Controller pasa Entity (DTO) a Service
- Service retorna Entity de respuesta
- No se pasan Models directamente

### SERVICE ↔ REPOSITORY
- Service llama métodos del Repository
- Repository retorna Models de BD
- Service usa Mapper para convertir si es necesario

### REPOSITORY ↔ MODEL
- Repository usa Model para consultas TypeORM
- Model define estructura de BD

### SERVICE ↔ MAPPER
- Service usa Mapper para transformar:
  - JSON plano → Entity
  - Entity + Model → Entity respuesta

### SERVICE ↔ INTEGRATION
- Service puede llamar APIs externas
- Integration retorna datos estructurados

### SERVICE ↔ PUBLISHER
- Service puede publicar mensajes
- Publisher maneja comunicación con brokers

## Validaciones

### Nivel Routes
- Validación de esquema con Joi
- Validación de formato HTTP

### Nivel Controller
- Validación de estructura de datos
- Manejo de errores HTTP

### Nivel Service
- Validación de reglas de negocio
- Validación de campos requeridos según plantilla

### Nivel Entity
- Validación de campos obligatorios
- Validación de tipos de datos

## Manejo de Errores

```
Error en Service → Controller → Routes → Cliente
  ↓
Logging en cada capa
  ↓
Respuesta HTTP apropiada (400, 404, 500)
```

## Extensibilidad

### Agregar Nuevo Endpoint
1. Agregar ruta en `routes/`
2. Crear método en `controllers/`
3. Implementar lógica en `services/`
4. Si requiere BD: usar `repositories/` y `models/`

### Agregar Nuevo Producto/Tipo Endoso
1. Insertar plantilla en BD (tabla `templates`)
2. No requiere cambios en código

### Agregar Nueva Integración Externa
1. Crear clase en `integration/`
2. Usar desde `services/`

### Agregar Nuevo Publisher
1. Crear clase en `publisher/`
2. Usar desde `services/`



