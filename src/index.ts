import 'reflect-metadata';
import { startServer } from './server';

startServer().catch((err) => {
  console.error('Fatal error starting server', err);
  process.exit(1);
});
