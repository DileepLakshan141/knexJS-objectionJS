"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const common_1 = require("@nestjs/common");
class BaseService {
    async findAll(filters = {}, page = 1, limit = 10, sort = 'createdAt:desc') {
        const query = this.buildQuery(filters);
        const [sortField, sortDirection] = sort.split(':');
        query.orderBy(sortField, sortDirection === 'desc' ? 'desc' : 'asc');
        const offset = (page - 1) * limit;
        const [data, total] = await Promise.all([
            query.offset(offset).limit(limit),
            query.resultSize(),
        ]);
        return {
            data: data,
            total,
            page,
            limit,
        };
    }
    async findById(id) {
        const item = await this.modelClass.query().findById(id);
        if (!item) {
            throw new common_1.NotFoundException(`${this.modelClass.name} with id ${id} not found`);
        }
        return item;
    }
    async create(data) {
        return this.modelClass
            .query()
            .insert(data)
            .returning('*');
    }
    async update(id, data) {
        const item = await this.modelClass.query().patchAndFetchById(id, data);
        if (!item) {
            throw new common_1.NotFoundException(`${this.modelClass.name} with id ${id} not found`);
        }
        return item;
    }
    async delete(id) {
        const deleted = await this.modelClass.query().deleteById(id);
        if (!deleted) {
            throw new common_1.NotFoundException(`${this.modelClass.name} with id ${id} not found`);
        }
    }
    buildQuery(filters) {
        let query = this.modelClass.query();
        Object.keys(filters).forEach((key) => {
            const value = filters[key];
            if (value !== undefined && value !== null && value !== '') {
                if (typeof value === 'string' && value.includes('%')) {
                    query = query.where(key, 'ilike', value);
                }
                else if (Array.isArray(value)) {
                    query = query.whereIn(key, value);
                }
                else {
                    query = query.where(key, value);
                }
            }
        });
        return query;
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=curd_service.service.js.map