import { IsString, IsEmail, IsInt } from 'class-validator';

export class SignInDto {
  @IsEmail()
  readonly email: string;

  @IsInt()
  readonly password: number;
}
