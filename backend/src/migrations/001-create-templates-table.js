const { MigrationInterface, QueryRunner } = require('typeorm');

class CreateTemplatesTable1700000000001 {
  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS templates (
        id SERIAL PRIMARY KEY,
        product VARCHAR(100) NOT NULL,
        "endorseType" VARCHAR(100) NOT NULL,
        "dynamicDataConfig" JSONB NOT NULL,
        "eventAppliedEntitiesConfig" JSONB NOT NULL,
        "defaultValues" JSONB,
        status VARCHAR(50) DEFAULT 'active',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(product, "endorseType")
      );

      CREATE INDEX IF NOT EXISTS idx_templates_product_endorse ON templates(product, "endorseType");
      CREATE INDEX IF NOT EXISTS idx_templates_status ON templates(status);
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE IF EXISTS templates;`);
  }
}

module.exports = CreateTemplatesTable1700000000001;

