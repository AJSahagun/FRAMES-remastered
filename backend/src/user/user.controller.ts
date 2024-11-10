import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, SetMetadata, UseGuards, Version, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../core/config/role.enum';
import { Roles } from '../core/decorators/roles/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserV2Dto } from './dto/create-user-v2.dto';
import { RolesGuard } from '../core/roles/roles.guard';
import { handleError } from '../core/config/errors';

@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Version('1')
  @Post()
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    const error = await this.userService.create(createUserDto);
    if (error) handleError(error);

    throw new HttpException('Success', HttpStatus.ACCEPTED)
  }

  @Version('2')
  @Post()
  async createV2(@Body(ValidationPipe) createUserDto: CreateUserV2Dto) {
    const error = await this.userService.createV2(createUserDto);
    if (error) handleError(error);
    
    throw new HttpException('Success', HttpStatus.ACCEPTED)
  }

  @Get()
  @Roles(Role.Dev, Role.Admin)
  findAll() {
    return this.userService.findAll();
  }

}
