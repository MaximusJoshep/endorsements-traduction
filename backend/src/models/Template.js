const { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } = require('typeorm');

class Template {
  constructor() {
    this.id = undefined;
    this.product = undefined;
    this.endorseType = undefined;
    this.dynamicDataConfig = undefined;
    this.eventAppliedEntitiesConfig = undefined;
    this.defaultValues = undefined;
    this.status = 'active';
    this.createdAt = undefined;
    this.updatedAt = undefined;
  }
}

module.exports = Template;
