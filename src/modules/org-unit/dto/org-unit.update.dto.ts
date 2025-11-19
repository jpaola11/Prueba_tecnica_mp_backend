import { PartialType } from '@nestjs/swagger';
import { CreateOrgUnitDto } from '../dto/create-org-unit.dto';

export class UpdateOrgUnitDto extends PartialType(CreateOrgUnitDto) {}
