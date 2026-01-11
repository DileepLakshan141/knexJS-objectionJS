import { Model, QueryBuilder } from 'objection';
export declare abstract class BaseService<T extends Model> {
    protected abstract modelClass: typeof Model & (new () => T);
    findAll(filters?: Record<string, any>, page?: number, limit?: number, sort?: string): Promise<{
        data: T[];
        total: number;
        page: number;
        limit: number;
    }>;
    findById(id: number): Promise<T>;
    create(data: Partial<T>): Promise<T>;
    update(id: number, data: Partial<T>): Promise<T>;
    delete(id: number): Promise<void>;
    protected buildQuery(filters: Record<string, string | number | Array<any> | undefined>): QueryBuilder<Model, Model[]>;
}
