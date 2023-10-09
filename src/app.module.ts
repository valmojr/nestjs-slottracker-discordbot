import { Module } from '@nestjs/common';
import { DiscordModule } from './discord/discord.module';
import { EventModule } from './event/event.module';
import { DatabaseService } from './database/database.service';
import { GuildModule } from './guild/guild.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [DiscordModule, EventModule, GuildModule, UserModule],
  controllers: [],
  providers: [DatabaseService],
})
export class AppModule {}
