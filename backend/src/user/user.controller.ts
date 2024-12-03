import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, SetMetadata, UseGuards, Version, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../core/config/role.enum';
import { Roles } from '../core/decorators/roles/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserV2Dto } from './dto/create-user-v2.dto';
import { handleError } from '../core/config/errors';
import { JwtGuard } from '../core/guards/jwt.guard';

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Version('1')
  @Post()
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    const error = await this.userService.create(createUserDto);
    if (error) handleError(error);

    throw new HttpException('Success', HttpStatus.ACCEPTED)
  }

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
  @Get(':school_id')
  @Roles(Role.Dev, Role.Admin)
  async findOne(@Param('school_id') school_id: string) {
    const data = await this.userService.findOne(school_id);
    if (data.error) handleError(data.error);
    
    return data
  }

}
