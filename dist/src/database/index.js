"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Knex = void 0;
const nestjs_knex_1 = require("nestjs-knex");
const knexConfig = require("../../knexfile");
const knexModuleOptions = {
    config: knexConfig['production'],
};
const Knex = nestjs_knex_1.KnexModule.forRoot(knexModuleOptions);
exports.Knex = Knex;
//# sourceMappingURL=index.js.map