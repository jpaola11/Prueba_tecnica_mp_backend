import { AppDataSource } from './config/db.config';
import { buildApp } from './app';

export async function startServer() {
  await AppDataSource.initialize();
  console.log('[DB] Conectado a SQL Server');

  const app = buildApp(AppDataSource);

  const port = Number(process.env.PORT) || 3001;
  app.listen(port, () => {
    console.log(`[HTTP] Server running on port ${port}`);
  });
}

// Opcional: auto-arranque si se ejecuta directamente
if (require.main === module) {
  startServer().catch((err) => {
    console.error('[FATAL] Error al iniciar el servidor', err);
    process.exit(1);
  });
}
