"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModel = void 0;
const objection_1 = require("objection");
class BaseModel extends objection_1.Model {
    id;
    created_at;
    updated_at;
    $beforeInsert() {
        this.created_at = new Date();
        this.updated_at = new Date();
    }
    $beforeUpdate() {
        this.updated_at = new Date();
    }
}
exports.BaseModel = BaseModel;
//# sourceMappingURL=base.model.js.map