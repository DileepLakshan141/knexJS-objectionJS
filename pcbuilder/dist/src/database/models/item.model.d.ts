import { BaseModel } from './base.model';
export declare class Item extends BaseModel {
    static tableName: string;
    name: string;
    price: number;
    stock: number;
}
