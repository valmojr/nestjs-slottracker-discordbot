import { Injectable, Logger } from '@nestjs/common';
import { Once, Context, ContextOf, On } from 'necord';
import { GuildService } from 'src/guild/guild.service';

@Injectable()
export class DiscordService {
  constructor(private readonly guildService: GuildService) {}
  private readonly logger = new Logger(DiscordService.name);

  @Once('ready')
  public async onReady(@Context() [client]: ContextOf<'ready'>) {
    this.logger.log(`Bot logged in as ${client.user.username}`);
  }

  @On('warn')
  public async onWarn(@Context() [message]: ContextOf<'warn'>) {
    this.logger.warn(message);
  }

  @On('guildCreate')
  public async onGuildCreate(@Context() [guild]: ContextOf<'guildCreate'>) {
    this.logger.log(`Guild ${guild.name} just added SlotTracker`);

    //this.guildService.createGuild(guild);
  }

  @On('guildDelete')
  async onGuildDelete(@Context() [guild]: ContextOf<'guildDelete'>) {
    this.logger.log(`Guild ${guild.name} just removed SlotTracker`);

    this.guildService.removeGuild(guild);
  }
}
