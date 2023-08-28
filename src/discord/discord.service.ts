import { Injectable, Logger } from '@nestjs/common';
import { Once, Context, ContextOf, On } from 'necord';

@Injectable()
export class DiscordService {
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
  }
}
