"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKnexConfig = void 0;
const createKnexConfig = (configService) => ({
    client: 'pg',
    connection: {
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        user: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_NAME', 'pcbuilder_db'),
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
    debug: configService.get('NODE_ENV') === 'development',
});
exports.createKnexConfig = createKnexConfig;
//# sourceMappingURL=database.config.js.map