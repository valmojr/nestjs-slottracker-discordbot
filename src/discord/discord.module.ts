import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { DiscordController } from './discord.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { NecordModule } from 'necord';
import { DiscordConfigService } from './discord.config.service';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    NecordModule.forRootAsync({
      useClass: DiscordConfigService,
    }),
  ],
  controllers: [DiscordController],
  providers: [DiscordService, DiscordConfigService],
})
export class DiscordModule {}
