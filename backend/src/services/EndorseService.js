const EndorseRequest = require('../entities/EndorseRequest.entity');
const EndorseMapper = require('../mappers/EndorseMapper');
const TemplateRepository = require('../repositories/Template.repository');
const logger = require('../config/logger');

/**
 * SERVICE: Contiene la lógica de negocio
 * Se comunica con:
 * - Controller (recibe Entity/DTO)
 * - Repository (obtiene Model de BD)
 * - Mapper (transforma entre Entity y Model)
 */
class EndorseService {
  constructor() {
    this.templateRepository = TemplateRepository;
  }

  /**
   * Transforma un JSON plano a JSON estructurado usando la plantilla de BD
   * @param {Object} plainJson - JSON plano de entrada
   * @returns {EndorseResponse} - Entity de respuesta estructurada
   */
  async translateEndorse(plainJson) {
    try {
      // 1. Mapper: Transformar JSON plano a Entity (DTO)
      const requestEntity = EndorseMapper.toEntity(plainJson);
      const validation = requestEntity.validate();

      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // 2. Repository: Buscar plantilla en BD (retorna Model)
      const templateModel = await this.templateRepository.findByProductAndEndorseType(
        requestEntity.producto,
        requestEntity.tipoEndoso
      );

      if (!templateModel) {
        throw new Error(
          `Template not found for product: ${requestEntity.producto} and endorseType: ${requestEntity.tipoEndoso}`
        );
      }

      // 3. Validar campos requeridos según la plantilla
      this.validateRequiredFields(requestEntity, templateModel);

      // 4. Mapper: Transformar Entity + Model a Entity de respuesta
      const structuredResponse = EndorseMapper.toStructuredResponse(requestEntity, templateModel);

      logger.info('Endorse translated successfully', {
        policyNumber: requestEntity.policyNumber,
        product: requestEntity.producto,
        endorseType: requestEntity.tipoEndoso,
      });

      return structuredResponse;
    } catch (error) {
      logger.error('Error translating endorse', { error: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Valida que los campos requeridos por la plantilla estén presentes
   * @param {EndorseRequest} requestEntity - Entity de entrada
   * @param {TemplateModel} templateModel - Model de plantilla desde BD
   */
  validateRequiredFields(requestEntity, templateModel) {
    if (!templateModel.dynamicDataConfig) return;

    const missingFields = [];
    templateModel.dynamicDataConfig.forEach((config) => {
      if (config.required && !config.defaultValue) {
        const value = EndorseMapper.getFieldValue(
          requestEntity,
          config.sourceField,
          config.defaultValue
        );
        if (!value || value === '') {
          missingFields.push(config.label || config.sourceField);
        }
      }
    });

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
  }
}

module.exports = new EndorseService();

