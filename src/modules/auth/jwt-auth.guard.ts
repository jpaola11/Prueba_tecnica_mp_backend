import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

interface JwtAccessPayload {
  sub: number;
  roles: string[];
  email?: string;
  username?: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader =
      request.headers['authorization'] || request.headers['Authorization'];

    if (!authHeader || typeof authHeader !== 'string') {
      throw new UnauthorizedException('TOKEN_NO_PROPORCIONADO');
    }

    const [scheme, token] = authHeader.split(' ');

    if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('FORMATO_TOKEN_INVALIDO');
    }

    try {
      const rawPayload = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET || 'access-secret',
      );

      // Narrowing obligatorio
      if (typeof rawPayload !== 'object' || rawPayload === null) {
        throw new UnauthorizedException('TOKEN_INVALIDO');
      }

      // Validaciones mínimas obligatorias
      const payload = rawPayload as Partial<JwtAccessPayload>;

      if (!payload.sub) {
        throw new UnauthorizedException('TOKEN_INVALIDO');
      }

      const user = {
        id: payload.sub,
        roles: payload.roles ?? [],
        email: payload.email,
        username: payload.username,
      };

      (request as any).user = user;

      return true;
    } catch {
      throw new UnauthorizedException('TOKEN_INVALIDO_O_EXPIRADO');
    }
  }
}
