import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, SetMetadata, UseGuards, Version } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../config/role.enum';
import { Roles } from '../decorators/roles/roles.decorator';
import { RolesGuard } from '../guards/roles/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserV2Dto } from './dto/create-user-v2.dto';

@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Version('1')
  @Post()
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Version('2')
  @Post()
  createV2(@Body(ValidationPipe) createUserDto: CreateUserV2Dto) {
    return this.userService.createV2(createUserDto);
  }

  @Get()
  @Roles(Role.Dev, Role.Admin)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
