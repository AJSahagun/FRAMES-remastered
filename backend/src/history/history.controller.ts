import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Version } from '@nestjs/common';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { Roles } from '../decorators/roles/roles.decorator';
import { Role } from '../config/role.enum';
import { RolesGuard } from '../guards/roles/roles.guard';

@Controller('history')
@UseGuards(RolesGuard)
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Version('2')
  @Post()
  create(@Body() createHistoryDto: CreateHistoryDto[]) {
    return this.historyService.create(createHistoryDto);
  }

  @Version('2')
  @Get()
  @Roles(Role.Dev, Role.Admin)
  findAll() {
    return this.historyService.findAll();
  }

}
