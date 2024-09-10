import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../database/database.module';
import { ApiKeyService } from '../services/api-key/api-key.service';

@Module({
  imports:[DatabaseModule],
  controllers: [UserController],
  providers: [UserService, ApiKeyService]
})
export class UserModule {}
