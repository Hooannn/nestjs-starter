import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CheckUserDto } from './dto/check-user.dto';
import { isEmail } from 'class-validator';
import ResponseBuilder from 'src/utils/response';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Public } from './auth.guard';
import { RefreshDto } from './dto/refresh-dto';

@Controller('auth')
export class AuthController {
  private readonly responseBuilder = new ResponseBuilder<any>();
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get()
  async checkUser(@Query() checkUserDto: CheckUserDto) {
    const email = Buffer.from(checkUserDto.email, 'base64').toString('ascii');
    if (!isEmail(email)) {
      throw new HttpException('Invalid email address', HttpStatus.BAD_REQUEST);
    }
    const user = await this.authService.checkUser({ email });
    if (!user) {
      throw new HttpException(
        'Unregistered email address',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.responseBuilder
      .code(200)
      .success(true)
      .data(user)
      .message('Available user')
      .build();
  }

  @Public()
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    const res = await this.authService.signIn(signInDto);
    return this.responseBuilder
      .code(200)
      .success(true)
      .data(res)
      .message('Signed in successfully')
      .build();
  }

  @Public()
  @Post('sign-in/renew-password')
  async signInWithRenewPassword(@Body() signInDto: SignInDto) {
    const res = await this.authService.signInWithRenewPassword(signInDto);
    return this.responseBuilder
      .code(200)
      .success(true)
      .data(res)
      .message('Signed in successfully')
      .build();
  }

  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const res = await this.authService.signUp(signUpDto);
    return this.responseBuilder
      .code(201)
      .success(true)
      .data(res)
      .message('Signed up successfully')
      .build();
  }

  @Public()
  @Post('sign-up/password')
  async createPassword(@Body() checkUserDto: CheckUserDto) {
    await this.authService.createPassword(checkUserDto);
    return this.responseBuilder
      .code(201)
      .success(true)
      .data(null)
      .message('Password has been sent successfully')
      .build();
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshDto) {
    const res = await this.authService.refresh(refreshDto);
    return this.responseBuilder
      .code(200)
      .success(true)
      .data(res)
      .message('Refreshed successfully')
      .build();
  }
}
