import { BaseModel } from './base.model';

export class Item extends BaseModel {
  static tableName = 'items';
  name!: string;
  price!: number;
  stock!: number;
}
