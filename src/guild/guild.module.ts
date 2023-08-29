import { Module } from '@nestjs/common';
import { GuildController } from './guild.controller';
import { GuildService } from './guild.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  imports: [],
  controllers: [GuildController],
  providers: [GuildService, DatabaseService],
})
export class GuildModule {}
