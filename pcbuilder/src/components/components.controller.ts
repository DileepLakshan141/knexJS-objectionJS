// src/components/components.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ComponentsService } from './components.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { QueryComponentDto } from './dto/query-component.dto';
import { ComponentResponseDto } from './dto/component-response.dto';

@ApiTags('components')
@Controller('components')
@UseInterceptors(ClassSerializerInterceptor)
export class ComponentsController {
  constructor(private readonly componentsService: ComponentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all components with filtering' })
  @ApiOkResponse({
    description: 'List of components',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/ComponentResponseDto' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['cpu', 'gpu', 'ram', 'motherboard', 'storage', 'psu', 'case'],
  })
  @ApiQuery({ name: 'manufacturer', required: false })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    example: 'createdAt:desc',
  })
  async findAll(@Query() queryDto: QueryComponentDto) {
    return this.componentsService.findAllWithQuery(queryDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search components by keyword' })
  @ApiOkResponse({
    type: [ComponentResponseDto],
    description: 'List of matching components',
  })
  @ApiQuery({ name: 'q', required: true, description: 'Search keyword' })
  async search(@Query('q') keyword: string) {
    return this.componentsService.searchComponents(keyword);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get components by type' })
  @ApiOkResponse({
    type: [ComponentResponseDto],
    description: 'List of components by type',
  })
  @ApiParam({
    name: 'type',
    enum: ['cpu', 'gpu', 'ram', 'motherboard', 'storage', 'psu', 'case'],
  })
  async findByType(@Param('type') type: string) {
    return this.componentsService.getComponentsByType(type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get component by ID' })
  @ApiOkResponse({
    type: ComponentResponseDto,
    description: 'Component found',
  })
  @ApiNotFoundResponse({ description: 'Component not found' })
  @ApiParam({ name: 'id', type: Number })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.componentsService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new component' })
  @ApiCreatedResponse({
    type: ComponentResponseDto,
    description: 'Component created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(@Body() createDto: CreateComponentDto) {
    return this.componentsService.createComponent(createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update component' })
  @ApiOkResponse({
    type: ComponentResponseDto,
    description: 'Component updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Component not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateComponentDto,
  ) {
    return this.componentsService.updateComponent(id, updateDto);
  }

  @Put(':id/stock')
  @ApiOperation({ summary: 'Update component stock' })
  @ApiOkResponse({
    type: ComponentResponseDto,
    description: 'Stock updated successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid quantity' })
  @ApiQuery({ name: 'quantity', required: true, type: Number, example: 5 })
  async updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Query('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.componentsService.updateStock(id, quantity);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete component' })
  @ApiNotFoundResponse({ description: 'Component not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.componentsService.delete(id);
  }
}
