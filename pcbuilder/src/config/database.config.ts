// src/config/database.config.ts
import { ConfigService } from '@nestjs/config';

export const createKnexConfig = (configService: ConfigService): any => ({
  client: 'pg',
  connection: {
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    user: configService.get<string>('DB_USERNAME', 'postgres'),
    password: configService.get<string>('DB_PASSWORD', ''),
    database: configService.get<string>('DB_NAME', 'pcbuilder_db'),
    charset: 'utf8',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './src/database/migrations',
  },
  seeds: {
    directory: './src/database/seeds',
  },
  debug: configService.get<string>('NODE_ENV') === 'development',
});
