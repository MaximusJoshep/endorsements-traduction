const EndorseService = require('../services/EndorseService');
const logger = require('../config/logger');

/**
 * CONTROLLER: Recibe solicitudes HTTP de Routes
 * Se comunica con Service y trabaja con Entity (DTO)
 * No debe acceder directamente a Repository o Model
 */
class EndorseController {
  constructor() {
    this.endorseService = EndorseService;
  }

  /**
   * Controlador para el endpoint de traducción de endosos
   * Recibe JSON plano y retorna JSON estructurado
   */
  async translate(request, h) {
    try {
      const plainJson = request.payload;

      if (!plainJson || typeof plainJson !== 'object') {
        return h
          .response({
            success: false,
            message: 'Invalid request body. Expected a JSON object.',
          })
          .code(400);
      }

      const structuredJson = await this.endorseService.translateEndorse(plainJson);

      return h
        .response({
          success: true,
          data: structuredJson,
        })
        .code(200);
    } catch (error) {
      logger.error('Controller error in translate', { error: error.message });

      const statusCode = error.message.includes('not found') ? 404 : 
                        error.message.includes('Validation') || error.message.includes('Missing') ? 400 : 500;

      return h
        .response({
          success: false,
          message: error.message || 'Internal server error',
        })
        .code(statusCode);
    }
  }
}

module.exports = new EndorseController();

