import { Injectable, Logger } from '@nestjs/common';
import { Once, Context, ContextOf, On } from 'necord';
import { GuildService } from 'src/guild/guild.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class DiscordService {
  constructor(
    private readonly guildService: GuildService,
    private readonly userService: UserService,
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

    const guildMembers = await this.guildService.fetchUsers(guild);

    guildMembers.forEach(async (member) => {
      await this.userService.createOrUpdateUser(member);
      await this.userService.addUserToGuild(member, guild);
    });
  }

  @On('guildDelete')
  async onGuildDelete(@Context() [guild]: ContextOf<'guildDelete'>) {
    this.logger.log(`Guild ${guild.name} just removed SlotTracker`);

    this.guildService.removeGuild(guild);
  }

  @On('guildMemberAdd')
  async onGuildMemberAdd(
    @Context() [guildMember]: ContextOf<'guildMemberAdd'>,
  ) {
    this.userService.createOrUpdateGuildMember(guildMember);

    this.userService.addGuildMemberToGuild(guildMember, guildMember.guild);
  }

  @On('guildMemberRemove')
  async onGuildMemberDelete(
    @Context() [guildMember]: ContextOf<'guildMemberRemove'>,
  ) {
    this.userService.removeGuildMemberFromGuild(guildMember, guildMember.guild);
  }

  @On('userAvatarUpdate')
  async onUserAvatarUpdate(@Context() [user]: ContextOf<'userAvatarUpdate'>) {
    this.userService.createOrUpdateUser(user);
  }
}
