import { Module } from '@nestjs/common';
import { GuildService } from './guild.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [GuildService, DatabaseService],
})
export class GuildModule {}
