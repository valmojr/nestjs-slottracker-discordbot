import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscordModule } from './discord/discord.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [DiscordModule, EventModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
