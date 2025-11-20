import {
    Controller,
    Get,
    Post,
    Put,
    Patch,
    Delete,
    Param,
    Body,
    Query,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
  } from '@nestjs/swagger';
  import { Request } from 'express';
  
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { UserService } from './user.service';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UpdateUserDto } from './dto/user.update.dto';
  import { UserQueryDto } from './dto/query-user.dto';
  import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
  import { IdParamDto } from '../../dto/helpers.dto';
  
  class UserResponseDto {
    id!: number;
    username!: string;
    email!: string;
    fullName!: string;
    orgUnitId!: number | null;
    isActive!: boolean;
    mustChangePassword!: boolean;
    lastLoginAt!: string | null;
    createdAt!: string;
    createdBy!: number;
    updatedAt!: string | null;
    updatedBy!: number | null;
    isDeleted!: boolean;
    deletedAt!: string | null;
    deletedBy!: number | null;
  }
  
  class PaginatedUserResponseDto {
    items!: UserResponseDto[];
    total!: number;
    page!: number;
    limit!: number;
  }
  
  class GenericMessageResponseDto {
    message!: string;
  }
  
  class CreateUserResponseDto extends GenericMessageResponseDto {
    userId!: number;
  }
  
  @ApiTags('Usuarios')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('users')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @Post()
    @ApiOperation({
      summary: 'Crear un nuevo usuario',
      description:
        'Crea un nuevo usuario en el sistema utilizando los datos proporcionados en la solicitud.',
    })
    @ApiResponse({
      status: 201,
      description: 'Usuario creado correctamente.',
      type: CreateUserResponseDto,
    })
    @ApiResponse({
      status: 400,
      description:
        'Solicitud inválida o error de validación en los datos del usuario.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 409,
      description:
        'Ya existe un usuario con el mismo nombre de usuario o correo electrónico.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description: 'Error interno del servidor al intentar crear el usuario.',
      type: GenericMessageResponseDto,
    })
    async create(
      @Body() dto: CreateUserDto,
      @Req() req: Request,
    ): Promise<CreateUserResponseDto> {
      const currentUserId = Number((req as any).user?.id);
      return this.userService.createUser(dto, currentUserId);
    }
  
    @Get()
    @ApiOperation({
      summary: 'Listar usuarios',
      description:
        'Devuelve un listado paginado de usuarios según los filtros y parámetros de búsqueda proporcionados.',
    })
    @ApiResponse({
      status: 200,
      description: 'Listado de usuarios obtenido correctamente.',
      type: PaginatedUserResponseDto,
    })
    @ApiResponse({
      status: 400,
      description:
        'Parámetros de consulta inválidos o error en los filtros de búsqueda.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar listar los usuarios.',
      type: GenericMessageResponseDto,
    })
    async list(
      @Query() query: UserQueryDto,
    ): Promise<PaginatedUserResponseDto> {
      return this.userService.listUsers(query);
    }
  
    @Get(':id')
    @ApiOperation({
      summary: 'Obtener detalle de un usuario',
      description:
        'Obtiene la información detallada de un usuario específico a partir de su identificador.',
    })
    @ApiResponse({
      status: 200,
      description: 'Usuario obtenido correctamente.',
      type: UserResponseDto,
    })
    @ApiResponse({
      status: 404,
      description: 'El usuario solicitado no existe.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar obtener el usuario.',
      type: GenericMessageResponseDto,
    })
    async getById(
      @Param() params: IdParamDto,
    ): Promise<UserResponseDto> {
      return this.userService.getUserById(params.id);
    }
  
    @Put(':id')
    @ApiOperation({
      summary: 'Actualizar un usuario',
      description:
        'Actualiza los datos de un usuario existente utilizando la información proporcionada en la solicitud.',
    })
    @ApiResponse({
      status: 200,
      description: 'Usuario actualizado correctamente.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 400,
      description:
        'Solicitud inválida, datos de actualización incorrectos o usuario eliminado previamente.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 404,
      description: 'El usuario a actualizar no existe.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 409,
      description:
        'Ya existe un usuario con el mismo nombre de usuario o correo electrónico.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar actualizar el usuario.',
      type: GenericMessageResponseDto,
    })
    async update(
      @Param() params: IdParamDto,
      @Body() dto: UpdateUserDto,
      @Req() req: Request,
    ): Promise<GenericMessageResponseDto> {
      const currentUserId = Number((req as any).user?.id);
      const result = await this.userService.updateUser(
        params.id,
        dto,
        currentUserId,
      );
      return { message: result.message };
    }
  
    @Patch(':id/password')
    @ApiOperation({
      summary: 'Actualizar la contraseña de un usuario',
      description:
        'Actualiza la contraseña de un usuario validando la contraseña actual y la confirmación de la nueva contraseña.',
    })
    @ApiResponse({
      status: 200,
      description: 'Contraseña actualizada correctamente.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 400,
      description:
        'La contraseña actual es incorrecta o la confirmación de la nueva contraseña no coincide.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 404,
      description: 'El usuario no existe.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar actualizar la contraseña del usuario.',
      type: GenericMessageResponseDto,
    })
    async updatePassword(
      @Param() params: IdParamDto,
      @Body() dto: UpdateUserPasswordDto,
      @Req() req: Request,
    ): Promise<GenericMessageResponseDto> {
      const currentUserId = Number((req as any).user?.id);
      return this.userService.updateUserPassword(
        params.id,
        dto,
        currentUserId,
      );
    }
  
    @Delete(':id')
    @ApiOperation({
      summary: 'Eliminar lógicamente un usuario',
      description:
        'Realiza el borrado lógico de un usuario, marcándolo como eliminado sin removerlo físicamente de la base de datos.',
    })
    @ApiResponse({
      status: 200,
      description: 'Usuario eliminado correctamente.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 404,
      description:
        'El usuario no existe o ya fue eliminado previamente.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar eliminar el usuario.',
      type: GenericMessageResponseDto,
    })
    async softDelete(
      @Param() params: IdParamDto,
      @Req() req: Request,
    ): Promise<GenericMessageResponseDto> {
      const currentUserId = Number((req as any).user?.id);
      return this.userService.softDeleteUser(params.id, currentUserId);
    }
  }
  