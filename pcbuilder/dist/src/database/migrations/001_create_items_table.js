"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('items', (table) => {
        table.increments('id').primary();
        table.string('name', 255).notNullable();
        table.decimal('price', 10, 2).notNullable();
        table.integer('stock').defaultTo(0);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}
async function down(knex) {
    await knex.schema.dropTable('items');
}
//# sourceMappingURL=001_create_items_table.js.map