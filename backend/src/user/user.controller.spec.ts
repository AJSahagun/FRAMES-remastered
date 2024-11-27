import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../core/database/database.module';
import { ApiKeyService } from '../core/services/api-key/api-key.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[DatabaseModule],
      controllers: [UserController],
      providers: [UserService, ApiKeyService, {provide:EventEmitter2, useValue:{emit:jest.fn()}}],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
