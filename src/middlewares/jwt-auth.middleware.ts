import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';

interface JwtAccessPayload {
  sub: number | string;
  roles?: string[];
  email?: string;
  username?: string;
}

interface RequestUser {
  id: number;
  roles: string[];
  email?: string;
  username?: string;
}

export const jwtAuthMiddleware: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader =
    (req.headers['authorization'] as string | undefined) ||
    (req.headers['Authorization'] as string | undefined);

  if (!authHeader) {
    return next(new UnauthorizedException('TOKEN_NO_PROPORCIONADO'));
  }

  const [scheme, token] = authHeader.split(' ');

  if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
    return next(new UnauthorizedException('FORMATO_TOKEN_INVALIDO'));
  }

  try {
    const rawPayload = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'access-secret');

    if (typeof rawPayload !== 'object' || rawPayload === null) {
      return next(new UnauthorizedException('TOKEN_INVALIDO'));
    }

    const payload = rawPayload as JwtAccessPayload;

    if (!payload.sub) {
      return next(new UnauthorizedException('TOKEN_INVALIDO'));
    }

    const id = Number(payload.sub);
    if (!Number.isFinite(id)) {
      return next(new UnauthorizedException('TOKEN_INVALIDO'));
    }

    const user: RequestUser = {
      id,
      roles: Array.isArray(payload.roles) ? payload.roles : [],
      email: payload.email,
      username: payload.username,
    };

    (req as any).user = user;

    return next();
  } catch {
    return next(new UnauthorizedException('TOKEN_INVALIDO_O_EXPIRADO'));
  }
};
