import * as dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',

  // --- Server ---
  PORT: Number(process.env.PORT) || 3001,

  // --- Database SQL Server ---
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: Number(process.env.DB_PORT) || 1433,
  DB_USER: process.env.DB_USER || '',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || '',

  // --- JWT ---
  JWT_SECRET: process.env.JWT_SECRET || 'PruebaTecnica',
};
