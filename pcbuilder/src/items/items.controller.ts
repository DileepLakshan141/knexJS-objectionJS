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
    const { minPrice, maxPrice, page, limit, ...otherFilters } = query;
    const filters: any = { ...otherFilters };
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: any = {};
      if (minPrice !== undefined) priceFilter.$gte = minPrice;
      if (maxPrice !== undefined) priceFilter.$lte = maxPrice;
      filters.price = priceFilter;
    }

    // Convert page and limit to numbers
    const pageNum = page ? Number(page) : 1;
    const limitNum = limit ? Number(limit) : 10;

    return this.itemsService.findAll(filters, pageNum, limitNum);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // Convert string param to number
    return this.itemsService.findById(Number(id));
  }

  @Post()
  create(@Body() dto: CreateItemDto) {
    return this.itemsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateItemDto>) {
    // Convert string param to number
    return this.itemsService.update(Number(id), dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    // Convert string param to number
    return this.itemsService.delete(Number(id));
  }
}
