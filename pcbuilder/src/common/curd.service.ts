import { Model, QueryBuilder } from 'objection';
import { NotFoundException } from '@nestjs/common';

export abstract class CurdService<T extends Model> {
  protected abstract modelClass: typeof Model & (new () => T);

  async findAll(
    filters: Record<string, any> = {},
    page = 1,
    limit = 10,
    sort = 'createdAt:desc',
  ) {
    let query: QueryBuilder<T, T[]> = this.modelClass.query();

    // Apply filters
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== undefined && value !== null && value !== '') {
        if (typeof value === 'string' && value.includes('%')) {
          query = query.where(key, 'ilike', value);
        } else if (Array.isArray(value)) {
          query = query.whereIn(key, value);
        } else {
          query = query.where(key, value);
        }
      }
    });

    // Sorting
    const [field, order] = sort.split(':');
    query.orderBy(field, order === 'desc' ? 'desc' : 'asc');

    // Pagination
    const offset = (page - 1) * limit;
    const [data, total] = await Promise.all([
      query.offset(offset).limit(limit),
      query.resultSize(),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: number): Promise<T> {
    const item = await this.modelClass.query().findById(id);
    if (!item) throw new NotFoundException(`${this.modelClass.name} not found`);
    return item as T;
  }

  async create(data: Partial<T>): Promise<T> {
    return (await this.modelClass.query().insert(data).returning('*')) as T;
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    const item = await this.modelClass.query().patchAndFetchById(id, data);
    if (!item) throw new NotFoundException(`${this.modelClass.name} not found`);
    return item as T;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.modelClass.query().deleteById(id);
    if (!deleted)
      throw new NotFoundException(`${this.modelClass.name} not found`);
  }
}
