import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { DatabaseModule } from '../core/database/database.module';
import { ApiKeyService } from '../core/services/api-key/api-key.service';

@Module({
  imports:[DatabaseModule],
  controllers: [HistoryController],
  providers: [HistoryService, ApiKeyService], 
})
export class HistoryModule {}
