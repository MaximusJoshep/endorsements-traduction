const EndorseService = require('../../services/EndorseService');
const EndorseMapper = require('../../mappers/EndorseMapper');
const TemplateRepository = require('../../repositories/Template.repository');

// Mock dependencies
jest.mock('../../mappers/EndorseMapper');
jest.mock('../../repositories/Template.repository');
jest.mock('../../config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('EndorseService', () => {
  let endorseService;

  beforeEach(() => {
    endorseService = EndorseService;
    jest.clearAllMocks();
  });

  describe('translateEndorse', () => {
    const mockPlainJson = {
      policyNumber: '08200000049',
      idEnvio: 5984,
      frecuencia: 'Semestral',
      tipoEndoso: 'CambioFrecuencia',
      producto: 'Rumbo',
      plan: 'PlanRumbo',
      moneda: 'Nuevo Sol',
      usuario: 'interface.servicios',
      fechaSolicitud: '2025-08-27',
      fechaCliente: '2025-08-27',
      fechaEfectiva: '2025-09-01',
    };

    const mockTemplateModel = {
      id: 1,
      product: 'Rumbo',
      endorseType: 'CambioFrecuencia',
      dynamicDataConfig: [
        { label: 'ProductosVida', sourceField: 'producto', required: true },
        { label: 'NombreUsuario', sourceField: 'usuario', required: false },
      ],
      eventAppliedEntitiesConfig: [
        { description: 'SolicitarEndoso', orderEvent: 1 },
        { description: 'AprobarEndoso', orderEvent: 2 },
      ],
      defaultValues: {
        eventDescription: 'SolicitarEndoso',
        moneda: 'Nuevo Sol',
      },
    };

    const mockRequestEntity = {
      policyNumber: '08200000049',
      producto: 'Rumbo',
      tipoEndoso: 'CambioFrecuencia',
      validate: jest.fn().returnValue({ isValid: true, errors: [] }),
    };

    const mockResponseEntity = {
      policyNumber: '08200000049',
      idEnvio: 5984,
      financialPlansEntity: { description: 'Semestral' },
      currency: { description: 'Nuevo Sol' },
      productEntity: { description: 'Rumbo' },
      eventEntity: {
        description: 'SolicitarEndoso',
        dynamicData: [],
      },
      eventAppliedEntities: [],
      riskUnitEntities: [],
      participationEntities: [],
    };

    it('should successfully translate endorse', async () => {
      EndorseMapper.toEntity.mockReturnValue(mockRequestEntity);
      TemplateRepository.findByProductAndEndorseType.mockResolvedValue(mockTemplateModel);
      EndorseMapper.toStructuredResponse.mockReturnValue(mockResponseEntity);

      const result = await endorseService.translateEndorse(mockPlainJson);

      expect(EndorseMapper.toEntity).toHaveBeenCalledWith(mockPlainJson);
      expect(TemplateRepository.findByProductAndEndorseType).toHaveBeenCalledWith(
        'Rumbo',
        'CambioFrecuencia'
      );
      expect(EndorseMapper.toStructuredResponse).toHaveBeenCalledWith(
        mockRequestEntity,
        mockTemplateModel
      );
      expect(result).toEqual(mockResponseEntity);
    });

    it('should throw error when validation fails', async () => {
      const invalidEntity = {
        validate: jest.fn().returnValue({
          isValid: false,
          errors: ['policyNumber is required'],
        }),
      };

      EndorseMapper.toEntity.mockReturnValue(invalidEntity);

      await expect(endorseService.translateEndorse(mockPlainJson)).rejects.toThrow(
        'Validation failed'
      );
    });

    it('should throw error when template not found', async () => {
      EndorseMapper.toEntity.mockReturnValue(mockRequestEntity);
      TemplateRepository.findByProductAndEndorseType.mockResolvedValue(null);

      await expect(endorseService.translateEndorse(mockPlainJson)).rejects.toThrow(
        'Template not found'
      );
    });
  });
});

