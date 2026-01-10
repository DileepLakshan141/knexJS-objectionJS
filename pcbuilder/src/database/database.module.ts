import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Knex from 'knex';
import { Model } from 'objection';
import { createKnexConfig } from 'src/config/database.config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'KnexConnection',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const knexConfig = createKnexConfig(configService);
        const knexInstance = Knex(knexConfig);
        Model.knex(knexInstance);
        return knexInstance;
      },
    },
  ],
  exports: ['KnexConnection'],
})
export class DatabaseModule {}
