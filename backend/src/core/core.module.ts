import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { ApiKeyService } from './services/api-key/api-key.service';

@Module({
    imports: [DatabaseModule, EventEmitterModule.forRoot()],
    providers: [ApiKeyService,{provide:APP_GUARD, useClass:RolesGuard}],
})
export class CoreModule {}
