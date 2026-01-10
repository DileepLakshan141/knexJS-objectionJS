import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import knex from 'knex';
import { Model } from 'objection';
import { KnexConfig } from '../../knexfile';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'KnexConnection',
      inject: [ConfigService],
      useFactory: () => {
        const knexInstance = knex(KnexConfig);
        Model.knex(knexInstance);
        return knexInstance;
      },
    },
  ],
  exports: ['KnexConnection'],
})
export class DatabaseModule {}
