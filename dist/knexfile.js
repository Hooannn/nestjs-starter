"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = require("./src/configs");
module.exports = {
    development: {
        client: 'pg',
        connection: configs_1.default['CONNECTION_STR'],
        searchPath: ['knex', 'public'],
    },
    staging: {
        client: 'pg',
        connection: configs_1.default['CONNECTION_STR'],
        searchPath: ['knex', 'public'],
        migrations: {
            tableName: 'knex_migrations',
        },
    },
    production: {
        client: 'pg',
        connection: configs_1.default['CONNECTION_STR'],
        searchPath: ['knex', 'public'],
        pool: {
            min: 2,
            max: 10,
        },
        migrations: {
            tableName: 'knex_migrations',
        },
    },
};
//# sourceMappingURL=knexfile.js.map