import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

export function setupSwagger(app: Application): void {
  const options: swaggerJsdoc.Options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'MP Dicri API',
        version: '1.0.0',
        description: 'API REST para gestión de usuarios, expedientes, evidencias y auditoría.',
      },
      servers: [
        {
          url: '/api',
          description: 'Servidor base',
        },
      ],
    },
    apis: [
      'src/modules/**/*.router.ts',
      'src/swagger/schemas.ts',
    ],
  };

  const specs = swaggerJsdoc(options);

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
}
