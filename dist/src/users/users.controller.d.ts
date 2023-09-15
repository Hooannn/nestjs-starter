import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    private readonly responseBuilder;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("src/utils/response").IResponse<User | User[]>>;
    findAll(): Promise<import("src/utils/response").IResponse<User | User[]>>;
    findOne(id: string): Promise<import("src/utils/response").IResponse<User | User[]>>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("src/utils/response").IResponse<User | User[]>>;
    remove(id: string): Promise<import("src/utils/response").IResponse<User | User[]>>;
}
