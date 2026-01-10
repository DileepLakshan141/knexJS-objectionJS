import { ApiProperty } from '@nestjs/swagger';
import { ComponentType } from '../component.model';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateComponentDto {
  @ApiProperty({ example: 'AMD Ryzen 9 5900X', description: 'Component name' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    enum: ComponentType,
    example: ComponentType.CPU,
    description: 'Component type',
  })
  @IsNotEmpty()
  @IsEnum(ComponentType)
  type!: ComponentType;

  @ApiProperty({ example: 'AMD', description: 'Manufacturer name' })
  @IsNotEmpty()
  @IsString()
  manufacturer!: string;

  @ApiProperty({ example: 'Ryzen 9 5900X', description: 'Model number/name' })
  @IsNotEmpty()
  @IsString()
  model!: string;

  @ApiProperty({
    example: {
      cores: 12,
      threads: 24,
      baseClock: '3.7GHz',
      boostClock: '4.8GHz',
    },
    description: 'Component specifications',
    required: false,
  })
  @IsOptional()
  @IsObject()
  specifications?: Record<string, any>;

  @ApiProperty({ example: 549.99, description: 'Price in USD' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({
    example: 10,
    description: 'Stock quantity',
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;
}
