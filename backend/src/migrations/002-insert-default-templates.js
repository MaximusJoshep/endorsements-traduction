const { MigrationInterface, QueryRunner } = require('typeorm');

class InsertDefaultTemplates1700000000002 {
  async up(queryRunner) {
    // Template para Rumbo - CambioFrecuencia
    await queryRunner.query(`
      INSERT INTO templates (product, "endorseType", "dynamicDataConfig", "eventAppliedEntitiesConfig", "defaultValues", status)
      VALUES (
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
          "frecuencia": "",
          "moneda": "Nuevo Sol",
          "producto": "Rumbo",
          "plan": "PlanRumbo"
        }'::jsonb,
        'active'
      )
      ON CONFLICT (product, "endorseType") DO NOTHING;
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
      DELETE FROM templates WHERE product = 'Rumbo' AND "endorseType" = 'CambioFrecuencia';
    `);
  }
}

module.exports = InsertDefaultTemplates1700000000002;

