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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const check_user_dto_1 = require("./dto/check-user.dto");
const class_validator_1 = require("class-validator");
const response_1 = require("../utils/response");
const sign_in_dto_1 = require("./dto/sign-in.dto");
const sign_up_dto_1 = require("./dto/sign-up.dto");
const auth_guard_1 = require("./auth.guard");
let AuthController = exports.AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.responseBuilder = new response_1.default();
    }
    async checkUser(checkUserDto) {
        const email = Buffer.from(checkUserDto.email, 'base64').toString('ascii');
        if (!(0, class_validator_1.isEmail)(email)) {
            throw new common_1.HttpException('Invalid email address', common_1.HttpStatus.BAD_REQUEST);
        }
        const user = await this.authService.checkUser({ email });
        if (!user) {
            throw new common_1.HttpException('Unregistered email address', common_1.HttpStatus.FORBIDDEN);
        }
        return this.responseBuilder
            .code(200)
            .success(true)
            .data(user)
            .message('Available user')
            .build();
    }
    async signIn(signInDto) {
        const user = await this.authService.signIn(signInDto);
        return this.responseBuilder
            .code(200)
            .success(true)
            .data(user)
            .message('Signed in successfully')
            .build();
    }
    async signUp(signUpDto) {
        const user = await this.authService.signUp(signUpDto);
        return this.responseBuilder
            .code(200)
            .success(true)
            .data(user)
            .message('Signed up successfully')
            .build();
    }
    async createPassword(checkUserDto) {
        await this.authService.createPassword(checkUserDto);
        return this.responseBuilder
            .code(200)
            .success(true)
            .data(null)
            .message('Password has been sent successfully')
            .build();
    }
};
__decorate([
    (0, auth_guard_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [check_user_dto_1.CheckUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkUser", null);
__decorate([
    (0, auth_guard_1.Public)(),
    (0, common_1.Post)('sign-in'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sign_in_dto_1.SignInDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    (0, auth_guard_1.Public)(),
    (0, common_1.Post)('sign-up'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sign_up_dto_1.SignUpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUp", null);
__decorate([
    (0, auth_guard_1.Public)(),
    (0, common_1.Post)('sign-up/password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [check_user_dto_1.CheckUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map