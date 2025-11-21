import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';
import { UserRole } from '../roles/user-role.entity';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

interface AuthUserRoleDto {
  id: number;
  code: string;
  name: string;
}

interface AuthUserDto {
  id: number;
  email: string | null;
  username: string | null;
  name: string | null;
  roles: AuthUserRoleDto[];
}

interface AuthTokensDto {
  accessToken: string;
  refreshToken: string;
  user: AuthUserDto;
}

interface JwtAccessPayload {
  sub: number;
  roles: string[];
  email?: string;
  username?: string;
}

interface JwtRefreshPayload {
  sub: number;
}

@Injectable()
export class AuthService {
  private readonly userRepo: Repository<User>;
  private readonly userRoleRepo: Repository<UserRole>;
  private readonly roleRepo: Repository<Role>;

  constructor(private readonly dataSource: DataSource) {
    this.userRepo = this.dataSource.getRepository(User);
    this.userRoleRepo = this.dataSource.getRepository(UserRole);
    this.roleRepo = this.dataSource.getRepository(Role);
  }

  private async loadUserWithRoles(userId: number): Promise<{ user: User; roles: Role[] }> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user) {
      throw new UnauthorizedException('USUARIO_NO_ENCONTRADO');
    }

    const userRoles = ((user as any).userRoles || []) as UserRole[];
    const roles: Role[] = userRoles.map((ur) => ur.role).filter((r): r is Role => !!r);

    return { user, roles };
  }

  private signAccessToken(user: User, roles: Role[]): string {
    const payload: JwtAccessPayload = {
      sub: user.id,
      email: (user as any).email,
      username: (user as any).username,
      roles: roles.map((r) => r.code),
    };

    const secret: jwt.Secret = (process.env.JWT_ACCESS_SECRET ?? 'access-secret') as jwt.Secret;

    const rawExpires = process.env.JWT_ACCESS_EXPIRES_IN;
    let expiresInValue: number | string | undefined;
    if (rawExpires == null) {
      expiresInValue = '60m';
    } else {
      const parsed = Number(rawExpires);
      expiresInValue = !Number.isNaN(parsed) && /^\d+$/.test(rawExpires) ? parsed : rawExpires;
    }

    const options: jwt.SignOptions = {
      expiresIn: expiresInValue as unknown as jwt.SignOptions['expiresIn'],
    };

    return jwt.sign(payload, secret, options);
  }

  private mapAuthUser(user: User, roles: Role[]): AuthUserDto {
    return {
      id: user.id,
      email: ((user as any).email ?? null) as string | null,
      username: ((user as any).username ?? null) as string | null,
      name: ((user as any).name ?? null) as string | null,
      roles: roles.map((r) => ({
        id: r.id,
        code: r.code,
        name: r.name,
      })),
    };
  }

  async validateUser(login: string, password: string): Promise<{ user: User; roles: Role[] }> {
    const qb = this.userRepo
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.userRoles', 'ur')
      .leftJoinAndSelect('ur.role', 'r')
      .where('u.isActive = :active', { active: true })
      .andWhere('u.deletedAt IS NULL')
      .andWhere('(u.email = :login OR u.username = :login)', { login });

    const user = await qb.getOne();

    if (!user) {
      throw new UnauthorizedException('CREDENCIALES_INVALIDAS');
    }

    const passwordHash = (user as any).passwordHash as string | undefined;

    if (!passwordHash) {
      throw new UnauthorizedException('CREDENCIALES_INVALIDAS');
    }

    const isValid = await bcrypt.compare(password, passwordHash);

    if (!isValid) {
      throw new UnauthorizedException('CREDENCIALES_INVALIDAS');
    }

    const userRoles = ((user as any).userRoles || []) as UserRole[];
    const roles: Role[] = userRoles.map((ur) => ur.role).filter((r): r is Role => !!r);

    return { user, roles };
  }

  async login(dto: LoginDto): Promise<AuthTokensDto> {
    const { user, roles } = await this.validateUser(dto.usernameOrEmail, dto.password);

    const accessToken = this.signAccessToken(user, roles);
    const refreshToken = this.signRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      user: this.mapAuthUser(user, roles),
    };
  }

  async refresh(dto: RefreshTokenDto): Promise<AuthTokensDto> {
    if (!dto.refreshToken) {
      throw new UnauthorizedException('TOKEN_REFRESH_REQUERIDO');
    }

    let payload: JwtRefreshPayload;

    try {
      payload = jwt.verify(
        dto.refreshToken,
        process.env.JWT_REFRESH_SECRET || 'refresh-secret'
      ) as unknown as JwtRefreshPayload;
    } catch {
      throw new UnauthorizedException('TOKEN_REFRESH_INVALIDO');
    }

    const { user, roles } = await this.loadUserWithRoles(payload.sub);

    const accessToken = this.signAccessToken(user, roles);
    const refreshToken = this.signRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      user: this.mapAuthUser(user, roles),
    };
  }

  async getProfile(userId: number): Promise<AuthUserDto> {
    if (!userId) {
      throw new UnauthorizedException('USUARIO_NO_AUTENTICADO');
    }

    const { user, roles } = await this.loadUserWithRoles(userId);
    return this.mapAuthUser(user, roles);
  }

  async changePassword(userId: number, dto: ChangePasswordDto): Promise<{ success: boolean }> {
    if (!userId) {
      throw new UnauthorizedException('USUARIO_NO_AUTENTICADO');
    }

    if (dto.newPassword !== dto.confirmNewPassword) {
      throw new BadRequestException('PASSWORD_NUEVA_NO_COINCIDE');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('USUARIO_NO_ENCONTRADO');
    }

    const passwordHash = (user as any).passwordHash as string | undefined;

    if (!passwordHash) {
      throw new UnauthorizedException('PASSWORD_ACTUAL_INCORRECTA');
    }

    const isValid = await bcrypt.compare(dto.currentPassword, passwordHash);

    if (!isValid) {
      throw new UnauthorizedException('PASSWORD_ACTUAL_INCORRECTA');
    }

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
    const newHash = await bcrypt.hash(dto.newPassword, saltRounds);

    (user as any).passwordHash = newHash;

    await this.userRepo.save(user);

    return { success: true };
  }

  signRefreshToken(userOrPayload: User | { userId: number }): string {
    const userId = ((userOrPayload as any).id ?? (userOrPayload as any).userId) as number;

    const secretEnv = process.env.JWT_REFRESH_SECRET  || 'refresh-secret';
    if (!secretEnv) {
      throw new Error('JWT_REFRESH_SECRET no está configurado.');
    }
    const secret: jwt.Secret = secretEnv as jwt.Secret;

    const rawExpires = process.env.JWT_REFRESH_EXPIRES_IN;
    let expiresInValue: number | string | undefined;
    if (rawExpires == null) {
      expiresInValue = '30d';
    } else {
      const parsed = Number(rawExpires);
      expiresInValue = !Number.isNaN(parsed) && /^\d+$/.test(rawExpires) ? parsed : rawExpires;
    }

    const options: jwt.SignOptions = {
      expiresIn: expiresInValue as unknown as jwt.SignOptions['expiresIn'],
    };

    return jwt.sign(
      {
        sub: userId,
        type: 'refresh',
      },
      secret,
      options
    );
  }
}
