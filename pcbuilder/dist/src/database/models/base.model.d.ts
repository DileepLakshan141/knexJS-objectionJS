import { Model } from 'objection';
export declare class BaseModel extends Model {
    readonly id: number;
    created_at: Date;
    updated_at: Date;
    $beforeInsert(): void;
    $beforeUpdate(): void;
}
