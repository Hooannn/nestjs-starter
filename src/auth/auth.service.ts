import {
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { generatePassword } from 'src/utils/password';
import Redis from 'ioredis';
import { hashSync, compareSync, hash } from 'bcrypt';
import config from 'src/configs';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { registerTemplate } from 'src/mailer/templates/password';

@Injectable()
export class AuthService {
  constructor(
    @InjectKnex() private readonly knex: Knex,
    @Inject('REDIS') private readonly redisClient: Redis,
    private usersService: UsersService,
    private mailerService: MailerService,
    private jwtService: JwtService,
  ) {}

  async checkUser(params: { email: string }) {
    try {
      const user = await this.knex
        .table('users')
        .select('first_name', 'last_name', 'id', 'email')
        .where({ email: params.email })
        .first();
      return user;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async signIn(signInDto: SignInDto) {
    try {
      const user = await this.usersService.findOneByEmail(signInDto.email);
      if (!user) throw new HttpException('Unregistered email address', 400);
      const isPasswordMatched = compareSync(
        signInDto.password.toString(),
        user.password.toString(),
      );
      if (!isPasswordMatched)
        throw new UnauthorizedException('Invalid password');

      const access_token = this.generateAccessToken(user.id);
      const refresh_token = this.generateRefreshToken(user.id);

      this.usersService.update(user.id, {
        refresh_token: refresh_token,
      });

      return { ...user, access_token, refresh_token };
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async createPassword(params: { email: string }) {
    try {
      const generatedPassword = generatePassword();
      return Promise.all([
        this.sendGeneratedPasswordMail(params.email, generatedPassword),
        this.redisClient.setex(`email:${params.email}`, 600, generatedPassword),
      ]);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async signUp(signUpDto: SignUpDto) {
    try {
      const user = await this.usersService.findOneByEmail(signUpDto.email);
      if (user) throw new HttpException('Registered email address', 400);
      const generatedPassword = await this.redisClient.get(
        `email:${signUpDto.email}`,
      );
      const isPasswordMatched =
        parseInt(generatedPassword) === signUpDto.password;

      if (!isPasswordMatched)
        throw new UnauthorizedException(`Invalid password`);

      const hashedPassword = hashSync(
        signUpDto.password.toString(),
        parseInt(config.SALTED_PASSWORD),
      );

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
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  private generateAccessToken(userId: string) {
    return this.jwtService.sign(
      { userId },
      {
        secret: config.ACCESS_TOKEN_SECRET,
        expiresIn: config.ACCESS_TOKEN_LIFE,
      },
    );
  }

  private generateRefreshToken(userId: string) {
    return this.jwtService.sign(
      { userId },
      {
        secret: config.REFRESH_TOKEN_SECRET,
        expiresIn: config.REFRESH_TOKEN_LIFE,
      },
    );
  }

  private async sendMail(mailOptions: ISendMailOptions) {
    return this.mailerService.sendMail(mailOptions);
  }

  private async sendGeneratedPasswordMail(email: string, password: number) {
    const mailOptions: ISendMailOptions = {
      to: email,
      subject: 'Register account - Money Master',
      html: registerTemplate(password),
    };
    return await this.sendMail(mailOptions);
  }
}
