// test/database-test.config.ts
import { Knex } from 'knex';

export const createTestKnexConfig = (): Knex.Config => ({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME
      ? `${process.env.DB_NAME}_test`
      : 'pcbuilder_db_test',
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: '../src/database/migrations',
  },
  seeds: {
    directory: '../src/database/seeds',
  },
  pool: {
    min: 1,
    max: 2,
  },
});
