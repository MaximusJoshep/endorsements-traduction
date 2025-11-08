const axios = require('axios');
const logger = require('../config/logger');

/**
 * INTEGRATION: Capa responsable de la comunicación con APIs HTTP externas
 * Se comunica con Service para realizar llamadas a servicios externos
 * Esta capa trabaja con Model cuando necesita estructurar datos de APIs externas
 */
class ExternalApiIntegration {
  constructor(baseURL, timeout = 5000) {
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Realiza una llamada GET a un endpoint externo
   * @param {string} endpoint - Ruta del endpoint
   * @param {Object} params - Parámetros de consulta
   * @returns {Promise<Object>} - Respuesta de la API externa
   */
  async get(endpoint, params = {}) {
    try {
      const response = await this.client.get(endpoint, { params });
      logger.info('External API GET request successful', { endpoint, params });
      return response.data;
    } catch (error) {
      logger.error('External API GET request failed', {
        endpoint,
        params,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Realiza una llamada POST a un endpoint externo
   * @param {string} endpoint - Ruta del endpoint
   * @param {Object} data - Datos a enviar
   * @returns {Promise<Object>} - Respuesta de la API externa
   */
  async post(endpoint, data = {}) {
    try {
      const response = await this.client.post(endpoint, data);
      logger.info('External API POST request successful', { endpoint });
      return response.data;
    } catch (error) {
      logger.error('External API POST request failed', {
        endpoint,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Realiza una llamada PUT a un endpoint externo
   * @param {string} endpoint - Ruta del endpoint
   * @param {Object} data - Datos a enviar
   * @returns {Promise<Object>} - Respuesta de la API externa
   */
  async put(endpoint, data = {}) {
    try {
      const response = await this.client.put(endpoint, data);
      logger.info('External API PUT request successful', { endpoint });
      return response.data;
    } catch (error) {
      logger.error('External API PUT request failed', {
        endpoint,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Realiza una llamada DELETE a un endpoint externo
   * @param {string} endpoint - Ruta del endpoint
   * @returns {Promise<Object>} - Respuesta de la API externa
   */
  async delete(endpoint) {
    try {
      const response = await this.client.delete(endpoint);
      logger.info('External API DELETE request successful', { endpoint });
      return response.data;
    } catch (error) {
      logger.error('External API DELETE request failed', {
        endpoint,
        error: error.message,
      });
      throw error;
    }
  }
}

module.exports = ExternalApiIntegration;

