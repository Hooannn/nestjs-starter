import { KnexModule, KnexModuleOptions } from 'nestjs-knex';
import * as knexConfig from '../../knexfile';
const knexModuleOptions: KnexModuleOptions = {
  config: knexConfig['production'],
};

const Knex = KnexModule.forRoot(knexModuleOptions);

export { Knex };
