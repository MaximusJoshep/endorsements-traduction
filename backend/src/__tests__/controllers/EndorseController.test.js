const EndorseController = require('../../controllers/EndorseController');
const EndorseService = require('../../services/EndorseService');

// Mock dependencies
jest.mock('../../services/EndorseService');
jest.mock('../../config/logger', () => ({
  error: jest.fn(),
}));

describe('EndorseController', () => {
  let endorseController;
  let mockH;

  beforeEach(() => {
    endorseController = EndorseController;
    mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('translate', () => {
    const mockRequest = {
      payload: {
        policyNumber: '08200000049',
        idEnvio: 5984,
        tipoEndoso: 'CambioFrecuencia',
        producto: 'Rumbo',
      },
    };

    const mockStructuredResponse = {
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

    it('should successfully translate and return structured JSON', async () => {
      EndorseService.translateEndorse.mockResolvedValue(mockStructuredResponse);

      const result = await endorseController.translate(mockRequest, mockH);

      expect(EndorseService.translateEndorse).toHaveBeenCalledWith(mockRequest.payload);
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: mockStructuredResponse,
      });
      expect(mockH.code).toHaveBeenCalledWith(200);
    });

    it('should return 400 for invalid request body', async () => {
      const invalidRequest = { payload: null };

      await endorseController.translate(invalidRequest, mockH);

      expect(mockH.response).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid request body. Expected a JSON object.',
      });
      expect(mockH.code).toHaveBeenCalledWith(400);
    });

    it('should return 404 when template not found', async () => {
      const error = new Error('Template not found for product: Rumbo');
      EndorseService.translateEndorse.mockRejectedValue(error);

      await endorseController.translate(mockRequest, mockH);

      expect(mockH.response).toHaveBeenCalledWith({
        success: false,
        message: error.message,
      });
      expect(mockH.code).toHaveBeenCalledWith(404);
    });

    it('should return 400 for validation errors', async () => {
      const error = new Error('Validation failed: policyNumber is required');
      EndorseService.translateEndorse.mockRejectedValue(error);

      await endorseController.translate(mockRequest, mockH);

      expect(mockH.response).toHaveBeenCalledWith({
        success: false,
        message: error.message,
      });
      expect(mockH.code).toHaveBeenCalledWith(400);
    });

    it('should return 500 for unexpected errors', async () => {
      const error = new Error('Internal server error');
      EndorseService.translateEndorse.mockRejectedValue(error);

      await endorseController.translate(mockRequest, mockH);

      expect(mockH.response).toHaveBeenCalledWith({
        success: false,
        message: error.message,
      });
      expect(mockH.code).toHaveBeenCalledWith(500);
    });
  });
});

