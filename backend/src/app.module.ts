import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RolesGuard } from './guards/roles/roles.guard';
import { ApiKeyService } from './services/api-key/api-key.service';
import { DatabaseModule } from './database/database.module';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [UserModule, DatabaseModule, EventEmitterModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, ApiKeyService, {provide:APP_GUARD, useClass:RolesGuard}],
})
export class AppModule {}
