import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('components', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table
      .enum('type', [
        'cpu',
        'gpu',
        'ram',
        'motherboard',
        'storage',
        'psu',
        'case',
      ])
      .notNullable();
    table.string('manufacturer', 100).notNullable();
    table.string('model', 100).notNullable();
    table.jsonb('specifications').defaultTo('{}');
    table.decimal('price', 10, 2).notNullable();
    table.integer('stock').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index(['type', 'manufacturer']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('components');
}
