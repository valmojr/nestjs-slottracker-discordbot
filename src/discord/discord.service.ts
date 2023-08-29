import { Injectable, Logger } from '@nestjs/common';
import { GuildMember } from 'discord.js';
import { Once, Context, ContextOf, On } from 'necord';
import { DatabaseService } from 'src/database/database.service';
import { GuildService } from 'src/guild/guild.service';

@Injectable()
export class DiscordService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly guildService: GuildService,
  ) {}
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

    this.guildService.createGuild(guild);
  }

  @On('guildDelete')
  async onGuildDelete(@Context() [guild]: ContextOf<'guildDelete'>) {
    this.logger.log(`Guild ${guild.name} just removed SlotTracker`);

    this.guildService.removeGuild(guild);
  }

  @On('guildMemberAdd')
  async onUserAdded(@Context() [guildMember]: ContextOf<'guildMemberAdd'>) {
    this.guildService.addGuildMemberToGuild(guildMember, guildMember.guild);
  }

  @On('guildMemberRemove')
  async onUserRemove(@Context() [guildMember]: ContextOf<'guildMemberRemove'>) {
    this.guildService.addGuildMemberToGuild(
      guildMember as GuildMember,
      guildMember.guild,
    );
  }
}
