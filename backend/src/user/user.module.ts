import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ApiKeyService } from 'src/services/api-key/api-key.service';

@Module({
  imports:[DatabaseModule],
  controllers: [UserController],
  providers: [UserService, ApiKeyService],
})
export class UserModule {}
