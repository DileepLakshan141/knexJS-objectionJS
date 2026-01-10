import { ApiProperty } from '@nestjs/swagger';
import { ComponentType } from '../component.model';

export class ComponentResponseDto {
  @ApiProperty({ example: 1, description: 'Component ID' })
  id!: number;

  @ApiProperty({ example: 'AMD Ryzen 9 5900X', description: 'Component name' })
  name!: string;

  @ApiProperty({ enum: ComponentType, example: ComponentType.CPU })
  type!: ComponentType;

  @ApiProperty({ example: 'AMD', description: 'Manufacturer name' })
  manufacturer!: string;

  @ApiProperty({ example: 'Ryzen 9 5900X', description: 'Model number/name' })
  model!: string;

  @ApiProperty({
    example: {
      cores: 12,
      threads: 24,
      baseClock: '3.7GHz',
      boostClock: '4.8GHz',
    },
    description: 'Component specifications',
  })
  specifications!: Record<string, any>;

  @ApiProperty({ example: 549.99, description: 'Price in USD' })
  price!: number;

  @ApiProperty({ example: 10, description: 'Stock quantity' })
  stock!: number;

  @ApiProperty({
    example: '2024-01-10T10:30:00.000Z',
    description: 'Creation timestamp',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2024-01-10T10:30:00.000Z',
    description: 'Last update timestamp',
  })
  updatedAt!: Date;
}
