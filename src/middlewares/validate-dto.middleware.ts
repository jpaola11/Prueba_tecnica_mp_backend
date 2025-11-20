import { Request, Response, NextFunction, RequestHandler } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

type RequestPart = 'body' | 'query' | 'params';

export function validateDto<T>(DtoClass: new () => T, part: RequestPart = 'body'): RequestHandler {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const source = req[part] ?? {};
    const dtoInstance = plainToInstance(DtoClass, source, {
      enableImplicitConversion: true,
    });

    const errors = await validate(dtoInstance as any, {
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
    });

    if (errors.length > 0) {
      const messages = errors.flatMap((e) => Object.values(e.constraints ?? {}));
      return next(
        new BadRequestException({
          message: 'VALIDACION_DATOS_INVALIDOS',
          errors: messages,
        })
      );
    }

    (req as any)[part] = dtoInstance;
    return next();
  };
}
