# 🔐 Credenciales de Login

## Información de Autenticación

El sistema de autenticación actual acepta **CUALQUIER combinación de usuario y contraseña**.

### ✅ Credenciales Válidas (Ejemplos)

Puedes usar cualquier combinación, por ejemplo:

- **Usuario:** `test` / **Contraseña:** `test`
- **Usuario:** `admin` / **Contraseña:** `admin`
- **Usuario:** `usuario1` / **Contraseña:** `123456`
- **Usuario:** `demo` / **Contraseña:** `demo`
- **Cualquier otra combinación que desees**

### 📝 Cómo Obtener el Token

**Desde el Frontend:**
1. Abre la aplicación en tu navegador
2. En la pantalla de login, ingresa cualquier usuario y contraseña
3. El sistema generará un token JWT automáticamente

**Desde la línea de comandos (curl):**

```bash
curl -X POST https://tu-backend-url.run.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 🔒 Usar el Token

Una vez que tengas el token, úsalo en el header `Authorization`:

```bash
curl -X POST https://tu-backend-url.run.app/v1/endorse/translate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "policyNumber": "08200000049",
    "idEnvio": 5984,
    "tipoEndoso": "CambioFrecuencia",
    "producto": "Rumbo"
  }'
```

### ⚠️ Advertencia de Seguridad

Este sistema de autenticación es **solo para desarrollo y demostración**. 

**Para producción, deberías implementar:**
- ✅ Validación de usuarios en base de datos
- ✅ Hash de contraseñas (bcrypt, argon2)
- ✅ Rate limiting para prevenir ataques de fuerza bruta
- ✅ OAuth2 o autenticación más robusta
- ✅ Refresh tokens
- ✅ Logout y revocación de tokens

### 🔄 Duración del Token

Los tokens JWT tienen una duración de **4 horas (14400 segundos)**.

Después de ese tiempo, necesitarás hacer login nuevamente.

