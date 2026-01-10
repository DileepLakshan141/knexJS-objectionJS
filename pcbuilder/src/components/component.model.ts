import { BaseModel } from 'src/database/models/base.model';

export enum ComponentType {
  CPU = 'cpu',
  GPU = 'gpu',
  RAM = 'ram',
  MOTHERBOARD = 'motherboard',
  STORAGE = 'storage',
  PSU = 'psu',
  CASE = 'case',
}

export class Component extends BaseModel {
  static tableName: string = 'components';

  name!: string;
  type!: ComponentType;
  manufacturer!: string;
  model!: string;
  specifications!: Record<string, any>;
  price!: number;
  stock!: number;

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'type', 'manufacturer', 'model', 'price'],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        type: {
          type: 'string',
          enum: Object.values(ComponentType),
        },
        manufacturer: { type: 'string', minLength: 1, maxLength: 100 },
        model: { type: 'string', minLength: 1, maxLength: 100 },
        specifications: {
          type: 'object',
          default: {},
        },
        price: { type: 'number', minimum: 0 },
        stock: { type: 'integer', minimum: 0, default: 0 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    };
  }
}
