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
  import { RoleService } from './role.service';
  import { CreateRoleDto } from './dto/create-role.dto';
  import { UpdateRoleDto } from './dto/role.update.dto';
  import { IdParamDto } from '../../dto/helpers.dto';
  
  class RoleResponseDto {
    id!: number;
    code!: string;
    name!: string;
    description!: string | null;
    isDefault!: boolean;
    createdAt!: string;
    createdBy!: number;
    updatedAt!: string | null;
    updatedBy!: number | null;
    isDeleted!: boolean;
    deletedAt!: string | null;
    deletedBy!: number | null;
  }
  
  class ListRoleResponseDto {
    items!: RoleResponseDto[];
    total!: number;
  }
  
  class GenericMessageResponseDto {
    message!: string;
  }
  
  class CreateRoleResponseDto extends GenericMessageResponseDto {
    roleId!: number;
  }
  
  @ApiTags('Roles')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('roles')
  export class RoleController {
    constructor(private readonly roleService: RoleService) {}
  
    @Post()
    @ApiOperation({
      summary: 'Crear un nuevo rol',
      description:
        'Crea un nuevo rol en el sistema utilizando los datos proporcionados en la solicitud.',
    })
    @ApiResponse({
      status: 201,
      description: 'Rol creado correctamente.',
      type: CreateRoleResponseDto,
    })
    @ApiResponse({
      status: 400,
      description:
        'Solicitud inválida o error de validación en los datos del rol.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 409,
      description:
        'Ya existe un rol con el mismo código (violación de índice único).',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description: 'Error interno del servidor al intentar crear el rol.',
      type: GenericMessageResponseDto,
    })
    async create(
      @Body() dto: CreateRoleDto,
      @Req() req: Request,
    ): Promise<CreateRoleResponseDto> {
      const currentUserId = Number((req as any).user?.id);
      return this.roleService.createRole(dto, currentUserId);
    }
  
    @Get()
    @ApiOperation({
      summary: 'Listar roles activos',
      description:
        'Devuelve el catálogo de roles activos registrados en el sistema.',
    })
    @ApiResponse({
      status: 200,
      description: 'Listado de roles activos obtenido correctamente.',
      type: ListRoleResponseDto,
    })
    @ApiResponse({
      status: 500,
      description: 'Error interno del servidor al intentar listar los roles.',
      type: GenericMessageResponseDto,
    })
    async list(): Promise<ListRoleResponseDto> {
      return this.roleService.listActiveRoles();
    }
  
    @Put(':id')
    @ApiOperation({
      summary: 'Actualizar un rol',
      description:
        'Actualiza los datos de un rol existente identificado por su identificador numérico.',
    })
    @ApiResponse({
      status: 200,
      description: 'Rol actualizado correctamente.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 400,
      description:
        'Solicitud inválida o error de validación en los datos de actualización.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 404,
      description: 'El rol a actualizar no existe.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 409,
      description:
        'Ya existe un rol con el mismo código (violación de índice único).',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description: 'Error interno del servidor al intentar actualizar el rol.',
      type: GenericMessageResponseDto,
    })
    async update(
      @Param() params: IdParamDto,
      @Body() dto: UpdateRoleDto,
      @Req() req: Request,
    ): Promise<GenericMessageResponseDto> {
      const currentUserId = Number((req as any).user?.id);
      return this.roleService.updateRole(params.id, dto, currentUserId);
    }
  
    @Delete(':id')
    @ApiOperation({
      summary: 'Eliminar lógicamente un rol',
      description:
        'Realiza el borrado lógico de un rol, marcándolo como eliminado sin removerlo físicamente de la base de datos.',
    })
    @ApiResponse({
      status: 200,
      description: 'Rol eliminado correctamente.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 404,
      description: 'El rol no existe o ya fue eliminado previamente.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description: 'Error interno del servidor al intentar eliminar el rol.',
      type: GenericMessageResponseDto,
    })
    async softDelete(
      @Param() params: IdParamDto,
      @Req() req: Request,
    ): Promise<GenericMessageResponseDto> {
      const currentUserId = Number((req as any).user?.id);
      return this.roleService.softDeleteRole(params.id, currentUserId);
    }
  }
  