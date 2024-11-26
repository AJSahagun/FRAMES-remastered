import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { DatabaseModule } from '../core/database/database.module';
import { ApiKeyService } from '../core/services/api-key/api-key.service';
import { HistoryGateway } from './history.gateway';

@Module({
  imports:[DatabaseModule],
  controllers: [HistoryController],
  providers: [HistoryService, ApiKeyService, HistoryGateway], 
  providers: [HistoryService, ApiKeyService, HistoryGateway], 
})
export class HistoryModule {}
