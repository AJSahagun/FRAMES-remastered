import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
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

  @Post()
  create(@Body() createHistoryDto: CreateHistoryDto) {
    return this.historyService.create(createHistoryDto);
  }

  @Get()
  @Roles(Role.Dev, Role.Admin)
  findAll() {
    return this.historyService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.historyService.findOne(+id);
  // }

}
