require('dotenv').config();
const Hapi = require('@hapi/hapi');
const AppDataSource = require('./config/database');
const logger = require('./config/logger');
const authPlugin = require('./plugins/auth');
const endorseRoutes = require('./routes/endorse.routes');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 4000,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
        headers: ['Accept', 'Content-Type', 'Authorization'],
        credentials: true,
      },
      validate: {
        failAction: async (request, h, err) => {
          if (process.env.NODE_ENV === 'production') {
            logger.error('Validation error', err);
            throw err;
          }
          return h.response(err).code(400).takeover();
        },
      },
    },
  });

  // Registrar plugins
  await server.register(authPlugin);

  // Health check endpoint
  server.route({
    method: 'GET',
    path: '/health',
    handler: (request, h) => {
      return h.response({ status: 'ok', timestamp: new Date().toISOString() }).code(200);
    },
    options: {
      auth: false,
    },
  });

  // API versioning
  const apiVersion = process.env.API_VERSION || 'v1';
  server.route({
    method: 'GET',
    path: `/${apiVersion}/info`,
    handler: (request, h) => {
      return h
        .response({
          name: 'Endorse Translate API',
          version: '1.0.0',
          apiVersion,
        })
        .code(200);
    },
    options: {
      auth: false,
    },
  });

  // Registrar rutas con versionamiento
  endorseRoutes.forEach((route) => {
    route.path = `/${apiVersion}${route.path}`;
    server.route(route);
  });

  // Inicializar base de datos
  try {
    //await AppDataSource.initialize();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error('Error connecting to database', error);
    process.exit(1);
  }

  // Manejo de errores no capturados
  process.on('unhandledRejection', (err) => {
    logger.error('Unhandled rejection', err);
    process.exit(1);
  });

  await server.start();
  logger.info(`Server running on ${server.info.uri}`);
  logger.info(`API version: ${apiVersion}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);

  return server;
};

init()
  .then((server) => {
    logger.info('Application started successfully');
  })
  .catch((err) => {
    logger.error('Failed to start application', err);
    process.exit(1);
  });

module.exports = init;

