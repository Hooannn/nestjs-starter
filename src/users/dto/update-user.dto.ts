import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  readonly avatar: string;

  @IsString()
  readonly refresh_token: string;

  @IsString()
  readonly reset_password_token: string;
}
