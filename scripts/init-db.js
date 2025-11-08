require('dotenv').config();
const AppDataSource = require('../backend/src/config/database');

async function initDatabase() {
  try {
    console.log('🔄 Inicializando base de datos...');
    
    await AppDataSource.initialize();
    console.log('✅ Conexión a base de datos establecida');

    // Ejecutar migraciones
    const { execSync } = require('child_process');
    console.log('🔄 Ejecutando migraciones...');
    execSync('npm run migration:run', { stdio: 'inherit' });
    
    console.log('✅ Base de datos inicializada correctamente');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al inicializar base de datos:', error);
    process.exit(1);
  }
}

initDatabase();



