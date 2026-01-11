import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item-dto';
import { QueryItemDto } from './dto/query-items-dto';
export declare class ItemsController {
    private readonly itemsService;
    constructor(itemsService: ItemsService);
    findAll(query: QueryItemDto): Promise<{
        data: import("../database/models/item.model").Item[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<import("../database/models/item.model").Item>;
    create(dto: CreateItemDto): Promise<import("../database/models/item.model").Item>;
    update(id: string, dto: Partial<CreateItemDto>): Promise<import("../database/models/item.model").Item>;
    delete(id: string): Promise<void>;
}
