const EndorseRequest = require('../entities/EndorseRequest.entity');
const EndorseResponse = require('../entities/EndorseResponse.entity');

/**
 * MAPPER: Transforma objetos entre diferentes capas y formatos
 * Se utiliza en Service para convertir entre Entity (DTO) y Model (BD)
 */
class EndorseMapper {
  /**
   * Mapea el JSON plano de entrada a la entidad EndorseRequest (Entity/DTO)
   * Entity se usa en Controller y Service
   */
  static toEntity(plainJson) {
    return new EndorseRequest(plainJson);
  }

  /**
   * Transforma un Model de BD a Entity (si fuera necesario)
   * En este caso, el template se usa directamente como Model
   */
  static modelToEntity(templateModel) {
    // El template model se usa directamente, no necesita transformación
    return templateModel;
  }

  /**
   * Transforma la entidad EndorseRequest a EndorseResponse usando la plantilla
   */
  static toStructuredResponse(requestEntity, template) {
    const response = new EndorseResponse();
    
    // Campos básicos
    response.policyNumber = requestEntity.policyNumber;
    response.idEnvio = requestEntity.idEnvio;

    // FinancialPlansEntity
    response.financialPlansEntity = {
      description: requestEntity.frecuencia || template.defaultValues?.frecuencia || '',
    };

    // Currency
    response.currency = {
      description: requestEntity.moneda || template.defaultValues?.moneda || '',
    };

    // ProductEntity
    response.productEntity = {
      description: requestEntity.producto || template.defaultValues?.producto || '',
    };

    // EventEntity con dynamicData
    response.eventEntity = {
      description: template.defaultValues?.eventDescription || 'SolicitarEndoso',
      dynamicData: this.buildDynamicData(requestEntity, template),
    };

    // EventAppliedEntities
    response.eventAppliedEntities = this.buildEventAppliedEntities(template);

    // RiskUnitEntities
    response.riskUnitEntities = this.buildRiskUnitEntities(requestEntity, template);

    // ParticipationEntities (vacío por defecto)
    response.participationEntities = [];

    return response;
  }

  /**
   * Construye el array de dynamicData según la configuración de la plantilla
   */
  static buildDynamicData(requestEntity, template) {
    if (!template.dynamicDataConfig || !Array.isArray(template.dynamicDataConfig)) {
      return [];
    }

    return template.dynamicDataConfig.map((config) => {
      const value = this.getFieldValue(requestEntity, config.sourceField, config.defaultValue);
      return {
        etiqueta: config.label,
        value: value || config.defaultValue || '',
      };
    });
  }

  /**
   * Construye el array de eventAppliedEntities según la configuración
   */
  static buildEventAppliedEntities(template) {
    if (!template.eventAppliedEntitiesConfig || !Array.isArray(template.eventAppliedEntitiesConfig)) {
      return [];
    }

    return template.eventAppliedEntitiesConfig
      .sort((a, b) => a.orderEvent - b.orderEvent)
      .map((config) => ({
        description: config.description,
        orderEvent: config.orderEvent,
      }));
  }

  /**
   * Construye el array de riskUnitEntities
   */
  static buildRiskUnitEntities(requestEntity, template) {
    return [
      {
        insuranceObjectEntities: [
          {
            insuranceObjectNumber: '1',
            coverageEntities: [],
            participationEntities: [],
          },
        ],
        plansEntity: {
          description: requestEntity.plan || template.defaultValues?.plan || '',
        },
        riskUnitNumber: '1',
      },
    ];
  }

  /**
   * Obtiene el valor de un campo del request o usa el valor por defecto
   */
  static getFieldValue(requestEntity, sourceField, defaultValue) {
    if (!sourceField) return defaultValue;

    // Mapeo de campos comunes
    const fieldMap = {
      policyNumber: requestEntity.policyNumber,
      producto: requestEntity.producto,
      usuario: requestEntity.usuario,
      frecuencia: requestEntity.frecuencia,
      tipoEndoso: requestEntity.tipoEndoso,
      fechaSolicitud: requestEntity.fechaSolicitud,
      fechaCliente: requestEntity.fechaCliente,
      fechaEfectiva: requestEntity.fechaEfectiva,
    };

    return fieldMap[sourceField] || defaultValue || '';
  }
}

module.exports = EndorseMapper;

