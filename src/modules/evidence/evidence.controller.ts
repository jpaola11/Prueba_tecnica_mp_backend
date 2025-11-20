import {
    Controller,
    Get,
    Post,
    Put,
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
  import { EvidenceService } from './evidence.service';
  import { CreateEvidenceDto } from './dto/create-evidence.dto';
  import { UpdateEvidenceDto } from './dto/evidence.update.dto';
  import { EvidenceQueryDto } from './dto/query-evidence.dto';
  import { IdParamDto } from '../../dto/helpers.dto';
  
  class EvidenceResponseDto {
    id!: number;
    caseId!: number;
    sequenceNumber!: number | null;
    description!: string;
    color!: string | null;
    sizeText!: string | null;
    weightValue!: number | null;
    weightUnit!: string | null;
    location!: string | null;
    technicianId!: number;
    observations!: string | null;
    createdAt!: string;
    createdBy!: number;
    updatedAt!: string | null;
    updatedBy!: number | null;
    isDeleted!: boolean;
    deletedAt!: string | null;
    deletedBy!: number | null;
  }
  
  class PaginatedEvidenceResponseDto {
    items!: EvidenceResponseDto[];
    total!: number;
    page!: number;
    limit!: number;
  }
  
  class GenericMessageResponseDto {
    message!: string;
  }
  
  class CreateEvidenceResponseDto extends GenericMessageResponseDto {
    evidenceId!: number;
  }
  
  @ApiTags('Evidencias')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('evidences')
  export class EvidenceController {
    constructor(private readonly evidenceService: EvidenceService) {}
  
    @Post()
    @ApiOperation({
      summary: 'Registrar una evidencia',
      description:
        'Registra una nueva evidencia asociada a un expediente, utilizando los datos proporcionados en la solicitud.',
    })
    @ApiResponse({
      status: 201,
      description: 'Evidencia registrada correctamente.',
      type: CreateEvidenceResponseDto,
    })
    @ApiResponse({
      status: 400,
      description:
        'Solicitud inválida o falta el identificador del expediente asociado a la evidencia.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 409,
      description:
        'Ya existe una evidencia con el mismo número de secuencia para el expediente.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar registrar la evidencia.',
      type: GenericMessageResponseDto,
    })
    async create(
      @Body() dto: CreateEvidenceDto,
      @Req() req: Request,
    ): Promise<CreateEvidenceResponseDto> {
      const currentUserId = Number((req as any).user?.id);
      return this.evidenceService.addEvidence(dto, currentUserId);
    }
  
    @Get()
    @ApiOperation({
      summary: 'Listar evidencias de un expediente',
      description:
        'Devuelve un listado paginado de evidencias asociadas a un expediente específico, identificado mediante parámetros de consulta.',
    })
    @ApiResponse({
      status: 200,
      description:
        'Listado de evidencias del expediente obtenido correctamente.',
      type: PaginatedEvidenceResponseDto,
    })
    @ApiResponse({
      status: 400,
      description:
        'Parámetros de consulta inválidos o falta el identificador del expediente.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar listar las evidencias del expediente.',
      type: GenericMessageResponseDto,
    })
    async listByCase(
      @Query() query: EvidenceQueryDto,
    ): Promise<PaginatedEvidenceResponseDto> {
      return this.evidenceService.listEvidencesByCase(query);
    }
  
    @Put(':id')
    @ApiOperation({
      summary: 'Actualizar una evidencia',
      description:
        'Actualiza los datos de una evidencia existente identificada por su identificador numérico.',
    })
    @ApiResponse({
      status: 200,
      description: 'Evidencia actualizada correctamente.',
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
      description: 'La evidencia a actualizar no existe.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar actualizar la evidencia.',
      type: GenericMessageResponseDto,
    })
    async update(
      @Param() params: IdParamDto,
      @Body() dto: UpdateEvidenceDto,
      @Req() req: Request,
    ): Promise<GenericMessageResponseDto> {
      const currentUserId = Number((req as any).user?.id);
      return this.evidenceService.updateEvidence(params.id, dto, currentUserId);
    }
  
    @Delete(':id')
    @ApiOperation({
      summary: 'Eliminar lógicamente una evidencia',
      description:
        'Realiza el borrado lógico de una evidencia, marcándola como eliminada sin removerla físicamente de la base de datos.',
    })
    @ApiResponse({
      status: 200,
      description: 'Evidencia eliminada correctamente.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 404,
      description:
        'La evidencia no existe o ya fue eliminada previamente.',
      type: GenericMessageResponseDto,
    })
    @ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al intentar eliminar la evidencia.',
      type: GenericMessageResponseDto,
    })
    async softDelete(
      @Param() params: IdParamDto,
      @Req() req: Request,
    ): Promise<GenericMessageResponseDto> {
      const currentUserId = Number((req as any).user?.id);
      return this.evidenceService.softDeleteEvidence(params.id, currentUserId);
    }
  }
  