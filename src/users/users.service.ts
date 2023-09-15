import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectKnex, Knex } from 'nestjs-knex';

@Injectable()
export class UsersService {
  constructor(@InjectKnex() private readonly knex: Knex) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const [user] = await this.knex.table('users').insert(createUserDto, '*');
      return user;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async findAll() {
    try {
      const users = await this.knex.table('users');
      return users;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.knex
        .table('users')
        .select('*')
        .where({ id })
        .first();
      return user;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.knex
        .table('users')
        .select('*')
        .where({ email })
        .first();
      return user;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async update(id: number, updateUserDto: Partial<UpdateUserDto>) {
    try {
      const [updatedRecord] = await this.knex
        .table('users')
        .where({ id })
        .update(updateUserDto, '*');
      return updatedRecord;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async remove(id: number) {
    try {
      const [deletedRecord] = await this.knex
        .table('users')
        .where({ id })
        .delete('*');
      return deletedRecord;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
