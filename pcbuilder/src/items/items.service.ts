import { Injectable } from '@nestjs/common';
import { Item } from '../database/models/item.model';
import { CurdService } from '../common/curd.service';

@Injectable()
export class ItemsService extends CurdService<Item> {
  protected modelClass = Item;
}
