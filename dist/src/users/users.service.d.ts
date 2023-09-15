import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Knex } from 'nestjs-knex';
export declare class UsersService {
    private readonly knex;
    constructor(knex: Knex);
    create(createUserDto: CreateUserDto): Promise<any>;
    findAll(): Promise<any[] | any[]>;
    findOne(id: number): Promise<any>;
    findOneByEmail(email: string): Promise<any>;
    update(id: number, updateUserDto: Partial<UpdateUserDto>): Promise<any>;
    remove(id: number): Promise<any>;
}
