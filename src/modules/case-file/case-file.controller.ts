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
  import { CaseFileService } from './case-file.service';
  import { CreateCaseFileDto } from './dto/create-case-file.dto';
  import { UpdateCaseFileDto } from './dto/case-file.upadate.dto';
  import { CaseFileQueryDto } from './dto/query-case-file.dto';
  import { ChangeCaseStatusDto } from './dto/change-case-status.dto';
  import { IdParamDto } from 'src/dto/shared/query-helpers.dto';
  
  class CaseFileResponseDto {
    id!: number;
    code!: string;
    title!: string;
    description!: string | null;
    orgUnitId!: number | null;
    technicianId!: number;
    statusId!: number;
    openDate!: string;
    closeDate!: string | null;
    referenceExternal!: string | null;
    createdAt!: string;
    createdBy!: number;
    updatedAt!: string | null;
    updatedBy!: number | null;
    isDeleted!: boolean;
    deletedAt!: string | null;
    deletedBy!: number | null;
  }
  
  class PaginatedCaseFileResponseDto {
    items!: CaseFileResponseDto[];
    total!: number;
    page!: number;
    limit!: number;
  }
  
  class GenericMessageResponseDto {
    message!: string;
  }
  
  class CreateCaseFileResponseDto extends GenericMessageResponseDto {
    caseId!: number;
  }
  
  @ApiTags('Expedientes')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('case-files')
  export class CaseFileController {
    constructor(private readonly caseFileService: CaseFileService) {}
  
    @Post()
    @ApiOperation({
      summary: 'Crear un nuevo expediente',
      description:
        'Crea un nuevo expediente en el sistema utilizando los datos proporcionados en la solicitud.',
    })
    @ApiResponse({
      status: 201,
      description: 'Expediente creado correctamente.',
      type: CreateCaseFileResponseDto,
    })
    @ApiResponse({
      status: 400,
      description:
        'Solicitud inválida o error de validación en los datos del expediente.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar crear el expediente.',
      type: GenericMessageResponseDto,
    })
    async create(
      @Body() dto: CreateCaseFileDto,
      @Req() req: Request,
    ): Promise<CreateCaseFileResponseDto> {
      const currentUserId = Number((req as any).user?.id);
      return this.caseFileService.createCase(dto, currentUserId);
    }
  
    @Get()
    @ApiOperation({
      summary: 'Listar expedientes',
      description:
        'Devuelve un listado paginado de expedientes según los filtros y parámetros de búsqueda proporcionados.',
    })
    @ApiResponse({
      status: 200,
      description: 'Listado de expedientes obtenido correctamente.',
      type: PaginatedCaseFileResponseDto,
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
        'Error interno del servidor al intentar listar los expedientes.',
      type: GenericMessageResponseDto,
    })
    async list(
      @Query() query: CaseFileQueryDto,
    ): Promise<PaginatedCaseFileResponseDto> {
      return this.caseFileService.listCases(query);
    }
  
    @Get(':id')
    @ApiOperation({
      summary: 'Obtener detalle de un expediente',
      description:
        'Obtiene la información detallada de un expediente específico a partir de su identificador.',
    })
    @ApiResponse({
      status: 200,
      description: 'Expediente obtenido correctamente.',
      type: CaseFileResponseDto,
    })
    @ApiResponse({
      status: 404,
      description: 'El expediente solicitado no existe.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar obtener el expediente.',
      type: GenericMessageResponseDto,
    })
    async getById(
      @Param() params: IdParamDto,
    ): Promise<CaseFileResponseDto> {
      return this.caseFileService.getCaseById(params.id);
    }
  
    @Put(':id')
    @ApiOperation({
      summary: 'Actualizar un expediente',
      description:
        'Actualiza la información de un expediente existente utilizando los datos proporcionados.',
    })
    @ApiResponse({
      status: 200,
      description: 'Expediente actualizado correctamente.',
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
      description: 'El expediente a actualizar no existe.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar actualizar el expediente.',
      type: GenericMessageResponseDto,
    })
    async update(
      @Param() params: IdParamDto,
      @Body() dto: UpdateCaseFileDto,
      @Req() req: Request,
    ): Promise<GenericMessageResponseDto> {
      const currentUserId = Number((req as any).user?.id);
      const result = await this.caseFileService.updateCase(
        params.id,
        dto,
        currentUserId,
      );
      return { message: result.message };
    }
  
    @Patch(':id/status')
    @ApiOperation({
      summary: 'Cambiar el estado de un expediente',
      description:
        'Modifica el estado de un expediente específico según el estado objetivo proporcionado.',
    })
    @ApiResponse({
      status: 200,
      description: 'Estado del expediente actualizado correctamente.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 400,
      description:
        'Solicitud inválida, transición de estado no permitida o error de validación.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 404,
      description: 'El expediente cuyo estado se desea cambiar no existe.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar cambiar el estado del expediente.',
      type: GenericMessageResponseDto,
    })
    async changeStatus(
      @Param() params: IdParamDto,
      @Body() dto: ChangeCaseStatusDto,
      @Req() req: Request,
    ): Promise<GenericMessageResponseDto> {
      const currentUserId = Number((req as any).user?.id);
      return this.caseFileService.changeStatus(params.id, dto, currentUserId);
    }
  
    @Delete(':id')
    @ApiOperation({
      summary: 'Eliminar lógicamente un expediente',
      description:
        'Realiza el borrado lógico de un expediente, marcándolo como eliminado sin removerlo físicamente de la base de datos.',
    })
    @ApiResponse({
      status: 200,
      description: 'Expediente eliminado correctamente.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 400,
      description:
        'Solicitud inválida o intento de eliminar un expediente ya eliminado.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 404,
      description: 'El expediente a eliminar no existe.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar eliminar el expediente.',
      type: GenericMessageResponseDto,
    })
    async softDelete(
      @Param() params: IdParamDto,
      @Req() req: Request,
    ): Promise<GenericMessageResponseDto> {
      const currentUserId = Number((req as any).user?.id);
      return this.caseFileService.softDeleteCase(params.id, currentUserId);
    }
  }
  