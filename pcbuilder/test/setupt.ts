// test/setup.ts
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

let app: INestApplication;

global.beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [],
  }).compile();

  app = moduleRef.createNestApplication();
  await app.init();
});

global.afterAll(async () => {
  await app.close();
});
