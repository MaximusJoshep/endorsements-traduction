const Joi = require('@hapi/joi');
const EndorseController = require('../controllers/EndorseController');

/**
 * ROUTES: Define los endpoints HTTP y dirige las solicitudes a Controller
 * Esta es la capa de entrada de la aplicación
 */

const endorseSchema = Joi.object({
  policyNumber: Joi.string().required(),
  idEnvio: Joi.number().integer().required(),
  frecuencia: Joi.string().allow('', null).optional(),
  tipoEndoso: Joi.string().required(),
  producto: Joi.string().required(),
  plan: Joi.string().allow('', null).optional(),
  moneda: Joi.string().allow('', null).optional(),
  usuario: Joi.string().allow('', null).optional(),
  fechaSolicitud: Joi.string().allow('', null).optional(),
  fechaCliente: Joi.string().allow('', null).optional(),
  fechaEfectiva: Joi.string().allow('', null).optional(),
});

const routes = [
  {
    method: 'POST',
    path: '/endorse/translate',
    handler: EndorseController.translate.bind(EndorseController),
    options: {
      auth: 'jwt',
      validate: {
        payload: endorseSchema,
        failAction: (request, h, err) => {
          return h
            .response({
              success: false,
              message: 'Validation error',
              details: err.details,
            })
            .code(400)
            .takeover();
        },
      },
      description: 'Transforma un JSON plano de endoso a JSON estructurado',
      notes: 'Recibe un JSON plano y lo transforma según la plantilla configurada en BD',
      tags: ['api', 'endorse'],
      response: {
        status: {
          200: Joi.object({
            success: Joi.boolean(),
            data: Joi.object(),
          }),
          400: Joi.object({
            success: Joi.boolean(),
            message: Joi.string(),
            details: Joi.optional(),
          }),
          404: Joi.object({
            success: Joi.boolean(),
            message: Joi.string(),
          }),
          500: Joi.object({
            success: Joi.boolean(),
            message: Joi.string(),
          }),
        },
      },
    },
  },
];

module.exports = routes;

