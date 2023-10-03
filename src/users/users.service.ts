import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectKnex, Knex } from 'nestjs-knex';
import { Role } from 'src/auth/auth.roles';
import { User } from './entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { compareSync, hashSync } from 'bcrypt';
import config from 'src/configs';
import Redis from 'ioredis';
import { QueryDto } from 'src/utils/query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectKnex() private readonly knex: Knex,
    @Inject('REDIS') private readonly redisClient: Redis,
  ) {}
  private SELECTED_COLUMNS: [
    'id',
    'first_name',
    'last_name',
    'avatar',
    'email',
    'roles',
    'created_at',
    'updated_at',
  ] = [
    'id',
    'first_name',
    'last_name',
    'avatar',
    'email',
    'roles',
    'created_at',
    'updated_at',
  ];

  async checkUser(params: { email: string }) {
    try {
      const res = await this.knex<User>('users')
        .select('first_name', 'last_name', 'id', 'email')
        .where('email', params.email)
        .first();
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async create(createUserDto: CreateUserDto, createdBy?: number) {
    try {
      const defaultRoles: Role[] = [Role.User];
      const [res] = await this.knex<User>('users').insert(
        {
          ...createUserDto,
          roles: defaultRoles,
          created_by: createdBy,
          updated_by: createdBy,
        },
        this.SELECTED_COLUMNS,
      );

      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(query: QueryDto) {
    try {
      const [res, counter] = await Promise.all([
        this.knex<User>('users')
          .column(this.SELECTED_COLUMNS)
          .offset(query.offset)
          .limit(query.limit),

        this.knex<User>('users').count('id'),
      ]);

      return {
        data: res,
        total: counter[0].count,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      const res = await this.knex<User>('users')
        .column(this.SELECTED_COLUMNS)
        .select()
        .where('id', id)
        .first();
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findOneByEmail(email: string) {
    try {
      const res = await this.knex<User>('users')
        .column(this.SELECTED_COLUMNS)
        .select()
        .where({ email })
        .first();
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findPassword(email: string) {
    try {
      const res = await this.knex<User>('users')
        .select('id', 'password')
        .where({ email })
        .first();
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findPasswordById(id: number) {
    try {
      const res = await this.knex<User>('users')
        .select('id', 'password')
        .where({ id })
        .first();
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async changePassword(id: number, changePasswordDto: ChangePasswordDto) {
    try {
      const user = await this.findPasswordById(id);
      if (!user)
        throw new HttpException('No such user', HttpStatus.BAD_REQUEST);
      const isCurrentPasswordValid = compareSync(
        changePasswordDto.current_password,
        user.password,
      );
      if (!isCurrentPasswordValid)
        throw new ForbiddenException('Invalid password');

      const newPassword = hashSync(
        changePasswordDto.new_password,
        parseInt(config.SALTED_PASSWORD),
      );

      const [res] = await this.knex<User>('users').where('id', id).update(
        {
          password: newPassword,
          updated_by: id,
        },
        this.SELECTED_COLUMNS,
      );

      await this.redisClient.del(`refresh_token:${id}`);
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto, updatedBy?: number) {
    try {
      const [res] = await this.knex<User>('users')
        .where('id', id)
        .update(
          { ...updateUserDto, updated_by: updatedBy },
          this.SELECTED_COLUMNS,
        );
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      const [res] = await this.knex<User>('users')
        .where('id', id)
        .delete(this.SELECTED_COLUMNS);
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
