# Modelo de Base de Datos

## Diagrama Entidad-Relación

```
┌─────────────────────────────────────────────────────────┐
│                    TEMPLATES                            │
├─────────────────────────────────────────────────────────┤
│ PK  id                    INT                           │
│     product               VARCHAR(100)                  │
│     endorseType           VARCHAR(100)                  │
│     dynamicDataConfig     JSONB                         │
│     eventAppliedEntitiesConfig JSONB                    │
│     defaultValues         JSONB                         │
│     status                VARCHAR(50) DEFAULT 'active'  │
│     createdAt             TIMESTAMP                     │
│     updatedAt             TIMESTAMP                     │
├─────────────────────────────────────────────────────────┤
│ UNIQUE(product, endorseType)                            │
│ INDEX(product, endorseType)                             │
│ INDEX(status)                                            │
└─────────────────────────────────────────────────────────┘
```

## Descripción de la Tabla

### templates

Tabla principal que almacena las plantillas de configuración para cada combinación de producto y tipo de endoso.

#### Campos

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Identificador único |
| `product` | VARCHAR(100) | NOT NULL, UNIQUE(product, endorseType) | Nombre del producto (ej: "Rumbo") |
| `endorseType` | VARCHAR(100) | NOT NULL, UNIQUE(product, endorseType) | Tipo de endoso (ej: "CambioFrecuencia") |
| `dynamicDataConfig` | JSONB | NOT NULL | Configuración de campos dinámicos |
| `eventAppliedEntitiesConfig` | JSONB | NOT NULL | Configuración de eventos aplicados |
| `defaultValues` | JSONB | NULL | Valores por defecto |
| `status` | VARCHAR(50) | DEFAULT 'active' | Estado de la plantilla |
| `createdAt` | TIMESTAMP | AUTO | Fecha de creación |
| `updatedAt` | TIMESTAMP | AUTO UPDATE | Fecha de última actualización |

#### Índices

- **PRIMARY KEY**: `id`
- **UNIQUE**: `(product, endorseType)` - Garantiza una sola plantilla por combinación
- **INDEX**: `(product, endorseType)` - Optimiza búsquedas
- **INDEX**: `status` - Optimiza filtros por estado

## Estructura de JSONB

### dynamicDataConfig

Array de objetos que define los campos dinámicos:

```json
[
  {
    "label": "ProductosVida",
    "sourceField": "producto",
    "required": true,
    "defaultValue": ""
  },
  {
    "label": "NombreUsuario",
    "sourceField": "usuario",
    "required": false,
    "defaultValue": ""
  }
]
```

**Campos**:
- `label`: Etiqueta que aparecerá en el JSON de salida
- `sourceField`: Campo del JSON de entrada (o null si es valor fijo)
- `required`: Si el campo es obligatorio
- `defaultValue`: Valor por defecto si no se proporciona

### eventAppliedEntitiesConfig

Array de objetos que define los eventos aplicados en orden:

```json
[
  {
    "description": "SolicitarEndoso",
    "orderEvent": 1
  },
  {
    "description": "AprobarEndoso",
    "orderEvent": 2
  }
]
```

**Campos**:
- `description`: Nombre del evento
- `orderEvent`: Orden de ejecución (se ordena automáticamente)

### defaultValues

Objeto con valores por defecto:

```json
{
  "eventDescription": "SolicitarEndoso",
  "moneda": "Nuevo Sol",
  "producto": "Rumbo",
  "plan": "PlanRumbo"
}
```

## Consultas Útiles

### Buscar plantilla por producto y tipo

```sql
SELECT * FROM templates
WHERE product = 'Rumbo'
  AND endorseType = 'CambioFrecuencia'
  AND status = 'active';
```

### Listar todos los productos únicos

```sql
SELECT DISTINCT product FROM templates
WHERE status = 'active'
ORDER BY product;
```

### Listar tipos de endoso por producto

```sql
SELECT DISTINCT endorseType FROM templates
WHERE product = 'Rumbo'
  AND status = 'active'
ORDER BY endorseType;
```

### Actualizar plantilla

```sql
UPDATE templates
SET dynamicDataConfig = '[...]'::jsonb,
    updatedAt = CURRENT_TIMESTAMP
WHERE product = 'Rumbo'
  AND endorseType = 'CambioFrecuencia';
```

## Ejemplo de Inserción

```sql
INSERT INTO templates (
  product,
  endorseType,
  dynamicDataConfig,
  eventAppliedEntitiesConfig,
  defaultValues,
  status
) VALUES (
  'Rumbo',
  'CambioFrecuencia',
  '[
    {"label": "ProductosVida", "sourceField": "producto", "required": true},
    {"label": "NombreUsuario", "sourceField": "usuario", "required": false, "defaultValue": ""},
    {"label": "NumeroPolizaEndoso", "sourceField": "policyNumber", "required": true},
    {"label": "TipoEndosoPol", "sourceField": "tipoEndoso", "required": true},
    {"label": "ResponsableAtencion", "sourceField": null, "required": false, "defaultValue": "SAC"},
    {"label": "EndosoModifPrima", "sourceField": null, "required": false, "defaultValue": "Si"},
    {"label": "InicioVigenciaEndoso", "sourceField": null, "required": false, "defaultValue": "Default"},
    {"label": "TipoVigenciaEndoso", "sourceField": null, "required": false, "defaultValue": ""},
    {"label": "EndososSimplesSACRumbo", "sourceField": null, "required": false, "defaultValue": "TES008"},
    {"label": "FechaSolicitud", "sourceField": "fechaSolicitud", "required": false, "defaultValue": ""},
    {"label": "FechaCliente", "sourceField": "fechaCliente", "required": false, "defaultValue": ""},
    {"label": "FechaEfectiva", "sourceField": "fechaEfectiva", "required": false, "defaultValue": ""}
  ]'::jsonb,
  '[
    {"description": "SolicitarEndoso", "orderEvent": 1},
    {"description": "AprobarEndoso", "orderEvent": 2}
  ]'::jsonb,
  '{
    "eventDescription": "SolicitarEndoso",
    "moneda": "Nuevo Sol",
    "producto": "Rumbo",
    "plan": "PlanRumbo"
  }'::jsonb,
  'active'
);
```

## Consideraciones de Diseño

### Ventajas del Diseño Actual

1. **Extensibilidad**: Agregar nuevos productos/tipos sin tocar código
2. **Flexibilidad**: Configuración completamente dinámica en JSONB
3. **Mantenibilidad**: Una sola tabla centraliza toda la configuración
4. **Performance**: Índices optimizan búsquedas frecuentes

### Posibles Mejoras Futuras

1. **Versionado de Plantillas**: Agregar campo `version` para historial
2. **Auditoría**: Tabla separada para cambios en plantillas
3. **Validación de Schema**: Validar estructura JSONB con constraints
4. **Cache**: Implementar cache de plantillas activas

## Migraciones

Las migraciones se encuentran en `src/migrations/`:

- `001-create-templates-table.js`: Crea la tabla templates
- `002-insert-default-templates.js`: Inserta plantilla de ejemplo

Para ejecutar:

```bash
npm run migration:run
```



