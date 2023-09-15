"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_knex_1 = require("nestjs-knex");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const password_1 = require("../utils/password");
const ioredis_1 = require("ioredis");
const bcrypt_1 = require("bcrypt");
const configs_1 = require("../configs");
const mailer_1 = require("@nestjs-modules/mailer");
const password_2 = require("../mailer/templates/password");
let AuthService = exports.AuthService = class AuthService {
    constructor(knex, redisClient, usersService, mailerService, jwtService) {
        this.knex = knex;
        this.redisClient = redisClient;
        this.usersService = usersService;
        this.mailerService = mailerService;
        this.jwtService = jwtService;
    }
    async checkUser(params) {
        try {
            const user = await this.knex
                .table('users')
                .select('first_name', 'last_name', 'id', 'email')
                .where({ email: params.email })
                .first();
            return user;
        }
        catch (error) {
            throw new common_1.HttpException(error, 400);
        }
    }
    async signIn(signInDto) {
        try {
            const user = await this.usersService.findOneByEmail(signInDto.email);
            if (!user)
                throw new common_1.HttpException('Unregistered email address', 400);
            const isPasswordMatched = (0, bcrypt_1.compareSync)(signInDto.password.toString(), user.password.toString());
            if (!isPasswordMatched)
                throw new common_1.UnauthorizedException('Invalid password');
            const access_token = this.generateAccessToken(user.id);
            const refresh_token = this.generateRefreshToken(user.id);
            this.usersService.update(user.id, {
                refresh_token: refresh_token,
            });
            return { ...user, access_token, refresh_token };
        }
        catch (error) {
            throw new common_1.HttpException(error, 400);
        }
    }
    async createPassword(params) {
        try {
            const generatedPassword = (0, password_1.generatePassword)();
            return Promise.all([
                this.sendGeneratedPasswordMail(params.email, generatedPassword),
                this.redisClient.setex(`email:${params.email}`, 600, generatedPassword),
            ]);
        }
        catch (error) {
            throw new common_1.HttpException(error, 400);
        }
    }
    async signUp(signUpDto) {
        try {
            const user = await this.usersService.findOneByEmail(signUpDto.email);
            if (user)
                throw new common_1.HttpException('Registered email address', 400);
            const generatedPassword = await this.redisClient.get(`email:${signUpDto.email}`);
            const isPasswordMatched = parseInt(generatedPassword) === signUpDto.password;
            if (!isPasswordMatched)
                throw new common_1.UnauthorizedException(`Invalid password`);
            const hashedPassword = (0, bcrypt_1.hashSync)(signUpDto.password.toString(), parseInt(configs_1.default.SALTED_PASSWORD));
            const createdUser = await this.usersService.create({
                email: signUpDto.email,
                password: hashedPassword,
                first_name: '',
                last_name: '',
            });
            const access_token = this.generateAccessToken(createdUser.id);
            const refresh_token = this.generateRefreshToken(createdUser.id);
            this.usersService.update(createdUser.id, {
                refresh_token: refresh_token,
            });
            return { ...createdUser, access_token, refresh_token };
        }
        catch (error) {
            throw new common_1.HttpException(error, 400);
        }
    }
    generateAccessToken(userId) {
        return this.jwtService.sign({ userId }, {
            secret: configs_1.default.ACCESS_TOKEN_SECRET,
            expiresIn: configs_1.default.ACCESS_TOKEN_LIFE,
        });
    }
    generateRefreshToken(userId) {
        return this.jwtService.sign({ userId }, {
            secret: configs_1.default.REFRESH_TOKEN_SECRET,
            expiresIn: configs_1.default.REFRESH_TOKEN_LIFE,
        });
    }
    async sendMail(mailOptions) {
        return this.mailerService.sendMail(mailOptions);
    }
    async sendGeneratedPasswordMail(email, password) {
        const mailOptions = {
            to: email,
            subject: 'Register account - Money Master',
            html: (0, password_2.registerTemplate)(password),
        };
        return await this.sendMail(mailOptions);
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_knex_1.InjectKnex)()),
    __param(1, (0, common_1.Inject)('REDIS')),
    __metadata("design:paramtypes", [Function, ioredis_1.default,
        users_service_1.UsersService,
        mailer_1.MailerService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map