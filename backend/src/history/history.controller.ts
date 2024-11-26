import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Version } from '@nestjs/common';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { Roles } from '../core/decorators/roles/roles.decorator';
import { Role } from '../core/config/role.enum';
import { RolesGuard } from '../core/guards/roles.guard';

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
