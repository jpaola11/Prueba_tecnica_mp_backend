import { AppDataSource } from './config/db.config';
import { buildApp } from './app';
import { setupSwagger } from './swagger';
import cors from 'cors';

export async function startServer() {
  await AppDataSource.initialize();
  console.log('[DB] Conectado a SQL Server');

  const app = buildApp(AppDataSource);

  app.use(
    cors({
      origin: ['http://localhost:5173', 'http://localhost:3001'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
      exposedHeaders: ['Authorization'],
    })
  );

  setupSwagger(app);

  const port = Number(process.env.PORT) || 3001;
  app.listen(port, () => {
    console.log(`[HTTP] Server running on port ${port}`);
    console.log(`[HTTP] Swagger disponible en http://localhost:${port}/docs`);
  });
}

if (require.main === module) {
  startServer().catch((err) => {
    console.error('[FATAL] Error al iniciar el servidor', err);
    process.exit(1);
  });
}
