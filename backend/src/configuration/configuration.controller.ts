import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { handleError } from '../core/config/errors';
import { Roles } from '../core/decorators/roles/roles.decorator';
import { Role } from '../core/config/role.enum';

@Controller('configuration')
export class ConfigurationController {
  constructor(
    private readonly configurationService: ConfigurationService
  
  ) {}
  @Get('tos')
  getTos(){
    try {
      return this.configurationService.getTos()
    } catch (error) {
      throw error
    }
  }
  @Get('max-occupants')
  getMaxOccupants(){
    try {
      return this.configurationService.getMaxOccupants()
    } catch (error) {
      throw error
    }
  }

  @Post()
  @Roles(Role.Dev, Role.Admin)
  create(@Body() createConfigurationDto: CreateConfigurationDto) {
    try {
      return this.configurationService.create(createConfigurationDto)
    } catch (error) {
      throw error
    }
  }
}
