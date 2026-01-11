"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const base_model_1 = require("./base.model");
class Item extends base_model_1.BaseModel {
    static tableName = 'items';
    name;
    price;
    stock;
}
exports.Item = Item;
//# sourceMappingURL=item.model.js.map