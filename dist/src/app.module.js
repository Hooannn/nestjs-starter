"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const database_1 = require("./database");
const notifications_module_1 = require("./notifications/notifications.module");
const nestjs_pino_1 = require("nestjs-pino");
const auth_module_1 = require("./auth/auth.module");
const redis_module_1 = require("./redis/redis.module");
const mailer_1 = require("@nestjs-modules/mailer");
const configs_1 = require("./configs");
const core_1 = require("@nestjs/core");
const auth_guard_1 = require("./auth/auth.guard");
const jwt_1 = require("@nestjs/jwt");
let AppModule = exports.AppModule = class AppModule {
};
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            database_1.Knex,
            notifications_module_1.NotificationsModule,
            nestjs_pino_1.LoggerModule.forRoot(),
            auth_module_1.AuthModule,
            jwt_1.JwtModule.register({
                global: false,
                secret: configs_1.default.JWT_AUTH_SECRET,
                signOptions: { expiresIn: '60s' },
            }),
            redis_module_1.RedisModule,
            mailer_1.MailerModule.forRoot({
                transport: {
                    service: 'gmail',
                    auth: {
                        user: configs_1.default.GMAIL_USER,
                        pass: configs_1.default.GMAIL_PASSWORD,
                    },
                },
                defaults: {
                    from: '<noreply@moneymaster.com>',
                },
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: auth_guard_1.AuthGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map