import { Model, QueryBuilder } from 'objection';
import { NotFoundException } from '@nestjs/common';

export abstract class BaseService<T extends Model> {
  protected abstract modelClass: typeof Model & (new () => T);

  async findAll(
    filters: Record<string, any> = {},
    page: number = 1,
    limit: number = 10,
    sort: string = 'createdAt:desc',
  ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    const query = this.buildQuery(filters);

    const [sortField, sortDirection] = sort.split(':');
    query.orderBy(sortField, sortDirection === 'desc' ? 'desc' : 'asc');

    const offset = (page - 1) * limit;
    const [data, total] = await Promise.all([
      query.offset(offset).limit(limit),
      query.resultSize(),
    ]);

    return {
      data: data as T[],
      total,
      page,
      limit,
    };
  }

  async findById(id: number): Promise<T> {
    const item = await this.modelClass.query().findById(id);

    if (!item) {
      throw new NotFoundException(
        `${this.modelClass.name} with id ${id} not found`,
      );
    }

    return item as T;
  }

  async create(data: Partial<T>): Promise<T> {
    return this.modelClass
      .query()
      .insert(data)
      .returning('*') as unknown as Promise<T>;
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    const item = await this.modelClass.query().patchAndFetchById(id, data);

    if (!item) {
      throw new NotFoundException(
        `${this.modelClass.name} with id ${id} not found`,
      );
    }

    return item as T;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.modelClass.query().deleteById(id);

    if (!deleted) {
      throw new NotFoundException(
        `${this.modelClass.name} with id ${id} not found`,
      );
    }
  }

  protected buildQuery(
    filters: Record<string, string | number | Array<any> | undefined>,
  ): QueryBuilder<Model, Model[]> {
    let query = this.modelClass.query();

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value !== undefined && value !== null && value !== '') {
        if (typeof value === 'string' && value.includes('%')) {
          // For partial string matching
          query = query.where(key, 'ilike', value);
        } else if (Array.isArray(value)) {
          // For array values (IN clause)
          query = query.whereIn(key, value);
        } else {
          // Exact match
          query = query.where(key, value);
        }
      }
    });

    return query;
  }
}
