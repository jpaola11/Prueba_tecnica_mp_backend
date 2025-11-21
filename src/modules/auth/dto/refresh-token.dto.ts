import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsArray,
  Min,
  Max,
  Length,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class RefreshTokenDto {
  @ApiProperty({
    name: 'refreshToken',
    description: 'Token de actualización emitido previamente por el sistema',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTcwMDk5OTk5OX0.abc123',
    default: '',
    type: String,
  })
  @IsString()
  @Length(1, 1000)
  refreshToken!: string;
}
