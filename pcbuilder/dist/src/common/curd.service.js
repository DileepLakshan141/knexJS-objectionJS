"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurdService = void 0;
const common_1 = require("@nestjs/common");
class CurdService {
    async findAll(filters = {}, page = 1, limit = 10, sort = 'created_at:desc') {
        let query = this.modelClass.query();
        Object.keys(filters).forEach((key) => {
            const value = filters[key];
            if (value !== undefined && value !== null && value !== '') {
                if (typeof value === 'object' && !Array.isArray(value)) {
                    Object.keys(value).forEach((operator) => {
                        const opValue = value[operator];
                        if (operator === '$gte') {
                            query = query.where(key, '>=', opValue);
                        }
                        else if (operator === '$lte') {
                            query = query.where(key, '<=', opValue);
                        }
                        else if (operator === '$gt') {
                            query = query.where(key, '>', opValue);
                        }
                        else if (operator === '$lt') {
                            query = query.where(key, '<', opValue);
                        }
                    });
                }
                else if (typeof value === 'string' && value.includes('%')) {
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
        const [field, order] = sort.split(':');
        query = query.orderBy(field, order === 'desc' ? 'desc' : 'asc');
        const offset = (page - 1) * limit;
        const countQuery = query.clone();
        const [data, total] = await Promise.all([
            query.offset(offset).limit(limit),
            countQuery.resultSize(),
        ]);
        return { data, total, page, limit };
    }
    async findById(id) {
        const item = (await this.modelClass.query().findById(id));
        if (!item)
            throw new common_1.NotFoundException(`${this.modelClass.name} not found`);
        return item;
    }
    async create(data) {
        const result = await this.modelClass.query().insert(data);
        return result;
    }
    async update(id, data) {
        const item = (await this.modelClass.query().patchAndFetchById(id, data));
        if (!item)
            throw new common_1.NotFoundException(`${this.modelClass.name} not found`);
        return item;
    }
    async delete(id) {
        const deleted = await this.modelClass.query().deleteById(id);
        if (!deleted) {
            throw new common_1.NotFoundException(`${this.modelClass.name} not found`);
        }
    }
}
exports.CurdService = CurdService;
//# sourceMappingURL=curd.service.js.map