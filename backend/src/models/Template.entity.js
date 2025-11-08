const { EntitySchema } = require('typeorm');

/**
 * MODEL: Define la estructura de datos almacenados en la base de datos
 * Esta capa se comunica con Repository para acceder a los datos
 */
const TemplateModel = new EntitySchema({
  name: 'Template',
  tableName: 'templates',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    product: {
      type: 'varchar',
      length: 100,
    },
    endorseType: {
      type: 'varchar',
      length: 100,
    },
    dynamicDataConfig: {
      type: 'jsonb',
    },
    eventAppliedEntitiesConfig: {
      type: 'jsonb',
    },
    defaultValues: {
      type: 'jsonb',
    },
    status: {
      type: 'varchar',
      length: 50,
      default: 'active',
    },
    createdAt: {
      type: 'timestamp',
      createDate: true,
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true,
    },
  },
  indices: [
    {
      columns: ['product', 'endorseType'],
      unique: true,
    },
  ],
});

module.exports = TemplateModel;

