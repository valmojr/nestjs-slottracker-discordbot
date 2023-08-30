import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { DiscordController } from './discord.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { NecordModule } from 'necord';
import { DiscordConfigService } from './discord.config.service';
import { DatabaseService } from 'src/database/database.service';
import { GuildModule } from 'src/guild/guild.module';
import { GuildService } from 'src/guild/guild.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    NecordModule.forRootAsync({
      useClass: DiscordConfigService,
    }),
    GuildModule,
  ],
  controllers: [DiscordController],
  providers: [
    DiscordService,
    DiscordConfigService,
    DatabaseService,
    GuildService,
    UserService,
  ],
})
export class DiscordModule {}
