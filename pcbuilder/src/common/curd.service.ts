import { Model, ModelClass, QueryBuilder } from 'objection';
import { NotFoundException } from '@nestjs/common';

type ModelClassOf<T extends Model> = ModelClass<T> & (new () => T);

export abstract class CurdService<T extends Model> {
  protected abstract modelClass: ModelClassOf<T>;

  async findAll(
    filters: Record<string, any> = {},
    page = 1,
    limit = 10,
    sort = 'created_at:desc',
  ) {
    let query = this.modelClass.query() as QueryBuilder<T>;
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== undefined && value !== null && value !== '') {
        if (typeof value === 'object' && !Array.isArray(value)) {
          Object.keys(value).forEach((operator) => {
            const opValue = value[operator];
            if (operator === '$gte') {
              query = query.where(key, '>=', opValue);
            } else if (operator === '$lte') {
              query = query.where(key, '<=', opValue);
            } else if (operator === '$gt') {
              query = query.where(key, '>', opValue);
            } else if (operator === '$lt') {
              query = query.where(key, '<', opValue);
            }
          });
        } else if (typeof value === 'string' && value.includes('%')) {
          query = query.where(key, 'ilike', value);
        } else if (Array.isArray(value)) {
          query = query.whereIn(key, value);
        } else {
          query = query.where(key, value);
        }
      }
    });

    const [field, order] = sort.split(':');
    query = query.orderBy(field, order === 'desc' ? 'desc' : 'asc');
    const offset = (page - 1) * limit;
    const countQuery = query.clone();
    const [data, total] = await Promise.all([
      query.offset(offset).limit(limit),
      countQuery.resultSize(),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: number): Promise<T> {
    const item = (await this.modelClass.query().findById(id)) as T | undefined;
    if (!item) throw new NotFoundException(`${this.modelClass.name} not found`);
    return item;
  }

  async create(data: Partial<T>): Promise<T> {
    const result = await this.modelClass.query().insert(data);
    return result as T;
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    const item = (await this.modelClass.query().patchAndFetchById(id, data)) as
      | T
      | undefined;
    if (!item) throw new NotFoundException(`${this.modelClass.name} not found`);
    return item;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.modelClass.query().deleteById(id);
    if (!deleted) {
      throw new NotFoundException(`${this.modelClass.name} not found`);
    }
  }
}
