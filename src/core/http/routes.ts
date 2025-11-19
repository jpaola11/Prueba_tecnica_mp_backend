import { Router, Request, Response } from 'express';

export const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'mp-dicri-api',
    timestamp: new Date().toISOString(),
  });
});
