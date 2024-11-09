import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../core/database/database.module';
import { UserService } from './user.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let mockSql: jest.Mock;
  let mockEventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[DatabaseModule],
      providers: [UserService,{provide:EventEmitter2, useValue:{emit:jest.fn()}}],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

});


