const AppDataSource = require('../config/database');
const TemplateModel = require('../models/Template.entity');

/**
 * REPOSITORY: Se comunica con Model para acceder y manipular datos en BD
 * Esta capa es utilizada por Service para operaciones de persistencia
 */
class TemplateRepository {
  constructor() {
    this.repository = null;
  }

  async initialize() {
    if (!this.repository) {
      const dataSource = await AppDataSource.initialize();
      this.repository = dataSource.getRepository('Template');
    }
    return this.repository;
  }

  /**
   * Busca una plantilla por producto y tipo de endoso
   * Retorna un Model (estructura de BD)
   */
  async findByProductAndEndorseType(product, endorseType) {
    const repo = await this.initialize();
    return await repo.findOne({
      where: {
        product,
        endorseType,
        status: 'active',
      },
    });
  }

  async findAll() {
    const repo = await this.initialize();
    return await repo.find({
      where: { status: 'active' },
    });
  }

  async create(templateData) {
    const repo = await this.initialize();
    const template = repo.create(templateData);
    return await repo.save(template);
  }

  async update(id, templateData) {
    const repo = await this.initialize();
    await repo.update(id, templateData);
    return await this.findById(id);
  }

  async findById(id) {
    const repo = await this.initialize();
    return await repo.findOne({ where: { id } });
  }
}

module.exports = new TemplateRepository();

