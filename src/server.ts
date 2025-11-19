import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { router } from './core/http/routes';

export async function startServer(): Promise<void> {
  dotenv.config();

  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(morgan('combined'));

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.use('/api', router);

  const port = Number(process.env.PORT) || 3001;
  app.listen(port, () => {
    console.log(`API running on port ${port}`);
    console.log(`Healthcheck → http://localhost:${port}/api/health`);
  });
}
