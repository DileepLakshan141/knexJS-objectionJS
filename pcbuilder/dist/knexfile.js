"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnexConfig = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const KnexConfig = {
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    migrations: {
        tableName: 'knex_migrations',
        directory: './src/database/migrations',
    },
    seeds: {
        directory: './src/database/seeds',
    },
};
exports.KnexConfig = KnexConfig;
exports.default = KnexConfig;
//# sourceMappingURL=knexfile.js.map