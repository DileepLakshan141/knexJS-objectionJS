import { Model } from 'objection';

export class BaseModel extends Model {
  readonly id!: number;
  created_at!: Date;
  updated_at!: Date;

  $beforeInsert() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  $beforeUpdate() {
    this.updated_at = new Date();
  }
}
