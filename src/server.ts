import express from 'express';
import { AppDataSource } from './config/db.config';

export async function startServer() {
  await AppDataSource.initialize();
  console.log('[DB] Conectado a SQL Server');

  const app = express();
  app.use(express.json());

  const port = Number(process.env.PORT) || 3001;
  app.listen(port, () => {
    console.log(`[HTTP] Server running on port ${port}`);
  });
}
