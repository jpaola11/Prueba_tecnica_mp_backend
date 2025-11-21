import { PartialType } from '@nestjs/swagger';
import { CreateCaseReviewDto } from './create-case-review.dto';

export class UpdateCaseReviewDto extends PartialType(CreateCaseReviewDto) {}
