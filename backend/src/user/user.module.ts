import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../database/database.module';
import { ApiKeyService } from '../services/api-key/api-key.service';
import { UserGateway } from './user.gateway';
import { EventEmitterModule } from '@nestjs/event-emitter';
@Module({
  imports:[DatabaseModule, forwardRef(()=>UserModule)],
  controllers: [UserController],
  providers: [UserService, ApiKeyService, UserGateway]
})
export class UserModule {}
