import { Injectable } from '@nestjs/common';
import { Component } from './component.model';
import { BaseService } from '../shared/services/curd_service.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { QueryComponentDto } from './dto/query-component.dto';

@Injectable()
export class ComponentsService extends BaseService<Component> {
  protected modelClass = Component;

  async findAllWithQuery(queryDto: QueryComponentDto) {
    const {
      type,
      manufacturer,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      sort = 'createdAt:desc',
    } = queryDto;

    const filters: Record<string, any> = {};

    if (type) filters.type = type;
    if (manufacturer) filters.manufacturer = manufacturer;

    if (minPrice !== undefined || maxPrice !== undefined) {
      filters.price = {} as { $gte?: number; $lte?: number };
      if (minPrice !== undefined) filters.price.$gte = minPrice;
      if (maxPrice !== undefined) filters.price.$lte = maxPrice;
    }

    return super.findAll(filters, page, limit, sort);
  }

  async createComponent(createDto: CreateComponentDto): Promise<Component> {
    return super.create({
      ...createDto,
      specifications: createDto.specifications || {},
      stock: createDto.stock || 0,
    });
  }

  async updateComponent(
    id: number,
    updateDto: UpdateComponentDto,
  ): Promise<Component> {
    return super.update(id, updateDto);
  }

  async updateStock(id: number, quantity: number): Promise<Component> {
    const component = await this.findById(id);

    const newStock = component.stock + quantity;
    if (newStock < 0) {
      throw new Error('Insufficient stock');
    }

    return super.update(id, { stock: newStock });
  }

  async getComponentsByType(type: string): Promise<Component[]> {
    return this.modelClass.query().where('type', type);
  }

  async searchComponents(keyword: string): Promise<Component[]> {
    return this.modelClass
      .query()
      .where('name', 'ilike', `%${keyword}%`)
      .orWhere('manufacturer', 'ilike', `%${keyword}%`)
      .orWhere('model', 'ilike', `%${keyword}%`);
  }
}
