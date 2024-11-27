import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Version, Query } from '@nestjs/common';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { Roles } from '../core/decorators/roles/roles.decorator';
import { Role } from '../core/config/role.enum';
import { JwtGuard } from '../core/guards/jwt.guard';
import { FindHistoryDTO } from './dto/find-history.dto';
import { handleError } from 'src/core/config/errors';

@Controller('history')
@UseGuards(JwtGuard)
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Version('2')
  @Post()
  create(@Body() createHistoryDto: CreateHistoryDto[]) {
    return this.historyService.create(createHistoryDto);
  }

  @Version('2')
  @Get()
  @Roles(Role.Dev, Role.Admin, Role.Librarian)
  findAll() {
    return this.historyService.findAll();
  }

  @Get('query')
  @Roles(Role.Dev, Role.Admin, Role.Librarian)
  @Version('2')
  async filterByQuery(@Query() query:FindHistoryDTO){
    const result=await this.historyService.filterByQuery(query)
    if(result.error) return handleError(result.error)
    return result
  }
}
