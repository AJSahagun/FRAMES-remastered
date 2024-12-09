import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { ApiKeyService } from './services/api-key/api-key.service';
import { JwtGuard } from './guards/jwt.guard';

@Module({
    imports: [DatabaseModule, EventEmitterModule.forRoot()],
    providers: [ApiKeyService, JwtGuard],
})
export class CoreModule {}
