import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import ResponseBuilder from 'src/utils/response';
import { User } from './entities/user.entity';
@Controller('users')
export class UsersController {
  private readonly responseBuilder = new ResponseBuilder<User | User[]>();
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return this.responseBuilder
      .code(201)
      .success(true)
      .data(user)
      .message('Created')
      .build();
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return this.responseBuilder
      .code(200)
      .success(true)
      .message('ok')
      .data(users)
      .build();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    return this.responseBuilder
      .code(200)
      .success(true)
      .message('ok')
      .data(user)
      .build();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedRecord = await this.usersService.update(+id, updateUserDto);
    return this.responseBuilder
      .code(200)
      .success(true)
      .data(updatedRecord)
      .message('Updated')
      .build();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const record = await this.usersService.remove(+id);
    return this.responseBuilder
      .code(200)
      .success(true)
      .message('Deleted')
      .data(record)
      .build();
  }
}
