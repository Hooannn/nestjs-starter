import type { Knex } from 'knex';
import config from './src/configs';
// Update with your config settings.
module.exports = {
  development: {
    client: 'pg',
    connection: config['CONNECTION_STR'],
    searchPath: ['knex', 'public'],
  },

  staging: {
    client: 'pg',
    connection: config['CONNECTION_STR'],
    searchPath: ['knex', 'public'],
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'pg',
    connection: config['CONNECTION_STR'],
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
/*
export const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: config['CONNECTION_STR'],
    searchPath: ['knex', 'public'],
  },

  staging: {
    client: 'pg',
    connection: config['CONNECTION_STR'],
    searchPath: ['knex', 'public'],
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'pg',
    connection: config['CONNECTION_STR'],
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
*/
