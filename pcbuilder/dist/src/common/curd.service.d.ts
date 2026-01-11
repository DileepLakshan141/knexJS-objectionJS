import { Model, ModelClass } from 'objection';
type ModelClassOf<T extends Model> = ModelClass<T> & (new () => T);
export declare abstract class CurdService<T extends Model> {
    protected abstract modelClass: ModelClassOf<T>;
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
}
export {};
