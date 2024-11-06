import { Test, TestingModule } from '@nestjs/testing';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { DatabaseModule } from '../database/database.module';
import { ApiKeyService } from '../services/api-key/api-key.service';

describe('HistoryController', () => {
  let controller: HistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[DatabaseModule],
      controllers: [HistoryController],
      providers: [HistoryService, ApiKeyService],
    }).compile();

    controller = module.get<HistoryController>(HistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
