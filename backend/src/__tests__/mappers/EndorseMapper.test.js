const EndorseMapper = require('../../mappers/EndorseMapper');
const EndorseRequest = require('../../entities/EndorseRequest.entity');
const EndorseResponse = require('../../entities/EndorseResponse.entity');

describe('EndorseMapper', () => {
  describe('toEntity', () => {
    it('should map plain JSON to EndorseRequest entity', () => {
      const plainJson = {
        policyNumber: '08200000049',
        idEnvio: 5984,
        frecuencia: 'Semestral',
        tipoEndoso: 'CambioFrecuencia',
        producto: 'Rumbo',
      };

      const result = EndorseMapper.toEntity(plainJson);

      expect(result).toBeInstanceOf(EndorseRequest);
      expect(result.policyNumber).toBe('08200000049');
      expect(result.producto).toBe('Rumbo');
      expect(result.tipoEndoso).toBe('CambioFrecuencia');
    });
  });

  describe('toStructuredResponse', () => {
    const mockRequestEntity = {
      policyNumber: '08200000049',
      idEnvio: 5984,
      frecuencia: 'Semestral',
      moneda: 'Nuevo Sol',
      producto: 'Rumbo',
      plan: 'PlanRumbo',
      usuario: 'interface.servicios',
      fechaSolicitud: '2025-08-27',
      fechaCliente: '2025-08-27',
      fechaEfectiva: '2025-09-01',
    };

    const mockTemplateModel = {
      dynamicDataConfig: [
        { label: 'ProductosVida', sourceField: 'producto', defaultValue: '' },
        { label: 'NombreUsuario', sourceField: 'usuario', defaultValue: '' },
        { label: 'NumeroPolizaEndoso', sourceField: 'policyNumber', defaultValue: '' },
      ],
      eventAppliedEntitiesConfig: [
        { description: 'SolicitarEndoso', orderEvent: 1 },
        { description: 'AprobarEndoso', orderEvent: 2 },
      ],
      defaultValues: {
        eventDescription: 'SolicitarEndoso',
        moneda: 'Nuevo Sol',
        plan: 'PlanRumbo',
      },
    };

    it('should transform entity to structured response', () => {
      const result = EndorseMapper.toStructuredResponse(mockRequestEntity, mockTemplateModel);

      expect(result).toBeInstanceOf(EndorseResponse);
      expect(result.policyNumber).toBe('08200000049');
      expect(result.idEnvio).toBe(5984);
      expect(result.financialPlansEntity.description).toBe('Semestral');
      expect(result.currency.description).toBe('Nuevo Sol');
      expect(result.productEntity.description).toBe('Rumbo');
      expect(result.eventEntity.description).toBe('SolicitarEndoso');
      expect(Array.isArray(result.eventAppliedEntities)).toBe(true);
      expect(Array.isArray(result.riskUnitEntities)).toBe(true);
    });

    it('should build dynamicData correctly', () => {
      const result = EndorseMapper.toStructuredResponse(mockRequestEntity, mockTemplateModel);

      expect(result.eventEntity.dynamicData).toHaveLength(3);
      expect(result.eventEntity.dynamicData[0]).toEqual({
        etiqueta: 'ProductosVida',
        value: 'Rumbo',
      });
      expect(result.eventEntity.dynamicData[1]).toEqual({
        etiqueta: 'NombreUsuario',
        value: 'interface.servicios',
      });
    });

    it('should build eventAppliedEntities in correct order', () => {
      const result = EndorseMapper.toStructuredResponse(mockRequestEntity, mockTemplateModel);

      expect(result.eventAppliedEntities).toHaveLength(2);
      expect(result.eventAppliedEntities[0].orderEvent).toBe(1);
      expect(result.eventAppliedEntities[1].orderEvent).toBe(2);
    });

    it('should use default values when fields are missing', () => {
      const incompleteEntity = {
        policyNumber: '08200000049',
        idEnvio: 5984,
        producto: 'Rumbo',
      };

      const result = EndorseMapper.toStructuredResponse(incompleteEntity, mockTemplateModel);

      expect(result.currency.description).toBe('Nuevo Sol');
      expect(result.riskUnitEntities[0].plansEntity.description).toBe('PlanRumbo');
    });
  });

  describe('getFieldValue', () => {
    const mockEntity = {
      policyNumber: '08200000049',
      producto: 'Rumbo',
      usuario: 'test.user',
      frecuencia: 'Semestral',
    };

    it('should return field value when sourceField exists', () => {
      const value = EndorseMapper.getFieldValue(mockEntity, 'producto', '');
      expect(value).toBe('Rumbo');
    });

    it('should return default value when sourceField is null', () => {
      const value = EndorseMapper.getFieldValue(mockEntity, null, 'DefaultValue');
      expect(value).toBe('DefaultValue');
    });

    it('should return default value when field does not exist', () => {
      const value = EndorseMapper.getFieldValue(mockEntity, 'nonExistent', 'Default');
      expect(value).toBe('Default');
    });
  });
});

