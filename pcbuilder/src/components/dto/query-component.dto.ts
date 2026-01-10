import { ApiPropertyOptional } from '@nestjs/swagger';
import { ComponentType } from '../component.model';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryComponentDto {
  @ApiPropertyOptional({
    enum: ComponentType,
    description: 'Filter by component type',
  })
  @IsOptional()
  @IsEnum(ComponentType)
  type?: ComponentType;

  @ApiPropertyOptional({
    example: 'AMD',
    description: 'Filter by manufacturer',
  })
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiPropertyOptional({ example: 100, description: 'Minimum price' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 1000, description: 'Maximum price' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ example: 1, description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Items per page',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 'createdAt:desc',
    description: 'Sort field and direction (format: field:direction)',
    default: 'createdAt:desc',
  })
  @IsOptional()
  @IsString()
  sort?: string = 'createdAt:desc';
}
