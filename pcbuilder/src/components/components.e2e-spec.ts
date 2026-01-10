/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// test/components.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { ComponentType } from '../../src/components/component.model';

describe('ComponentsController (e2e)', () => {
  let app: INestApplication;

  const testComponent = {
    name: 'AMD Ryzen 9 5900X',
    type: ComponentType.CPU,
    manufacturer: 'AMD',
    model: 'Ryzen 9 5900X',
    specifications: {
      cores: 12,
      threads: 24,
      baseClock: '3.7GHz',
      boostClock: '4.8GHz',
    },
    price: 549.99,
    stock: 10,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /components', () => {
    it('should create a new component', async () => {
      const response = await request(app.getHttpServer())
        .post('/components')
        .send(testComponent)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(testComponent.name);
      expect(response.body.type).toBe(testComponent.type);
    });

    it('should reject invalid data', async () => {
      await request(app.getHttpServer())
        .post('/components')
        .send({
          name: '', // Empty name
          type: 'invalid_type', // Invalid type
          price: -100, // Negative price
        })
        .expect(400);
    });
  });

  describe('GET /components', () => {
    it('should return all components', async () => {
      const response = await request(app.getHttpServer())
        .get('/components')
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
    });
  });
});
