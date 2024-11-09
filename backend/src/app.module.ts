import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { HistoryModule } from './history/history.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [CoreModule, UserModule, HistoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
