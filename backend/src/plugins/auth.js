const jwt = require('@hapi/jwt');

const register = async (server) => {
  await server.register(jwt);

  server.auth.strategy('jwt', 'jwt', {
    keys: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    verify: {
      aud: false,
      iss: false,
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: 14400, // 4 hours
      timeSkewSec: 15,
    },
    validate: async (artifacts, request, h) => {
      // Aquí puedes agregar validación adicional del token
      // Por ejemplo, verificar si el usuario existe en BD
      return {
        isValid: true,
        credentials: {
          user: artifacts.decoded.payload.user || 'anonymous',
        },
      };
    },
  });

  // Ruta para generar tokens
  // NOTA: En producción, considera implementar autenticación más segura
  server.route({
    method: 'POST',
    path: '/auth/login',
    handler: (request, h) => {
      const { username, password } = request.payload;
      
      // Validación simple - acepta cualquier usuario y contraseña
      // ⚠️ ADVERTENCIA: En producción real, implementa validación segura con hash de contraseñas
      if (username && password) {
        const token = jwt.token.generate(
          {
            aud: 'urn:audience:test',
            iss: 'urn:issuer:test',
            sub: username,
            user: username,
          },
          {
            key: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
            algorithm: 'HS256',
          },
          {
            ttlSec: 14400, // 4 hours
          }
        );

        return h.response({ token }).code(200);
      }

      return h.response({ message: 'Invalid credentials' }).code(401);
    },
    options: {
      auth: false,
    },
  });
};

module.exports = {
  name: 'auth',
  register,
};



