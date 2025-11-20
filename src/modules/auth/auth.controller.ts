import {
    Controller,
    Post,
    Body,
    Get,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
  import { Request } from 'express';
  import { AuthService } from './auth.service';
  import { LoginDto } from './dto/login.dto';
  import { RefreshTokenDto } from './dto/refresh-token.dto';
  import { ChangePasswordDto } from './dto/change-password.dto';
  import { JwtAuthGuard } from './jwt-auth.guard';
  
  @ApiTags('Autenticación')
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Post('login')
    @ApiOperation({ summary: 'Autenticar usuario y emitir tokens JWT' })
    async login(@Body() dto: LoginDto) {
      return this.authService.login(dto);
    }
  
    @Post('refresh')
    @ApiOperation({ summary: 'Refrescar tokens JWT a partir de un refresh token' })
    async refresh(@Body() dto: RefreshTokenDto) {
      return this.authService.refresh(dto);
    }
  
    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener el perfil del usuario autenticado' })
    async me(@Req() req: Request) {
      const userId = (req as any).user?.id as number | undefined;
      return this.authService.getProfile(userId as number);
    }
  
    @Post('change-password')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Cambiar la contraseña del usuario autenticado' })
    async changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto) {
      const userId = (req as any).user?.id as number | undefined;
      return this.authService.changePassword(userId as number, dto);
    }
  }
  