/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// test/setup.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Model } from 'objection';
import knex from 'knex';

let app: INestApplication;
let knexInstance: any;

beforeAll(async () => {
  // Create test database connection
  knexInstance = knex({
    client: 'sqlite3',
    connection: {
      filename: ':memory:', // In-memory SQLite database
    },
    useNullAsDefault: true,
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/database/migrations',
    },
    pool: {
      min: 1,
      max: 1,
    },
  });

  // Bind Objection.js to test Knex instance
  Model.knex(knexInstance);

  // Run migrations
  await knexInstance.migrate.latest();
});

beforeEach(async () => {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [],
  }).compile();

  app = moduleRef.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.init();
});

afterEach(async () => {
  // Clean up database after each test
  await knexInstance('components').del();
  await app.close();
});

afterAll(async () => {
  await knexInstance.destroy();
});
