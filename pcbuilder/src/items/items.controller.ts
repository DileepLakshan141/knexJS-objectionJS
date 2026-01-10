import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item-dto';
import { QueryItemDto } from './dto/query-items-dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll(@Query() query: QueryItemDto) {
    const { minPrice, maxPrice, page, limit, ...filters } = query;

    // Price filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      filters.price = {};
      if (minPrice !== undefined) filters.price.$gte = minPrice;
      if (maxPrice !== undefined) filters.price.$lte = maxPrice;
    }

    return this.itemsService.findAll(filters, page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.itemsService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateItemDto) {
    return this.itemsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: Partial<CreateItemDto>) {
    return this.itemsService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.itemsService.delete(id);
  }
}
