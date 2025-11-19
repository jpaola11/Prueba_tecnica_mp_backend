import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 1433,
  username: 'admin',
  password: 'Admin!123',
  database: process.env.DB_NAME || 'Pruebamp',
  synchronize: false,
  logging: process.env.DB_LOGGING === 'false',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
});
