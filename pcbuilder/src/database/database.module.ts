/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/database/database.module.ts
import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import knex from 'knex';
import { Model } from 'objection';
import { createKnexConfig } from '../config/database.config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'KnexConnection',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const knexConfig = createKnexConfig(configService);
        const knexInstance = knex(knexConfig);

        // Bind Objection.js to Knex
        Model.knex(knexInstance);

        return knexInstance;
      },
    },
  ],
  exports: ['KnexConnection'],
})
export class DatabaseModule {}
