import { PartialType } from '@nestjs/swagger';
import { CreateCaseStatusDto } from './create-case-status.dto';

export class UpdateCaseStatusDto extends PartialType(CreateCaseStatusDto) {}
