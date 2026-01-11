import { Item } from '../database/models/item.model';
import { CurdService } from '../common/curd.service';
export declare class ItemsService extends CurdService<Item> {
    protected modelClass: typeof Item;
}
