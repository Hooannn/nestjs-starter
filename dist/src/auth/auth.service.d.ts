import { Knex } from 'nestjs-knex';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import Redis from 'ioredis';
import { MailerService } from '@nestjs-modules/mailer';
export declare class AuthService {
    private readonly knex;
    private readonly redisClient;
    private usersService;
    private mailerService;
    private jwtService;
    constructor(knex: Knex, redisClient: Redis, usersService: UsersService, mailerService: MailerService, jwtService: JwtService);
    checkUser(params: {
        email: string;
    }): Promise<any>;
    signIn(signInDto: SignInDto): Promise<any>;
    createPassword(params: {
        email: string;
    }): Promise<[any, "OK"]>;
    signUp(signUpDto: SignUpDto): Promise<any>;
    private generateAccessToken;
    private generateRefreshToken;
    private sendMail;
    private sendGeneratedPasswordMail;
}
