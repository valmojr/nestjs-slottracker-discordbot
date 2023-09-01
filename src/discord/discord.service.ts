import { Injectable, Logger } from '@nestjs/common';
import { Once, Context, ContextOf, On } from 'necord';
import { EventService } from 'src/event/event.service';
import { GuildService } from 'src/guild/guild.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class DiscordService {
  constructor(
    private readonly guildService: GuildService,
    private readonly userService: UserService,
    private readonly eventService: EventService,
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

  @On('userUpdate')
  async onUserUpdate(@Context() [user]: ContextOf<'userUpdate'>) {
    this.userService.createOrUpdateUser(user);
  }

  @On('guildScheduledEventCreate')
  async onGuildScheduledEventCreate(
    @Context() [event]: ContextOf<'guildScheduledEventCreate'>,
  ) {
    // TODO - Check if the event is a SlotTracker Event (it must be on DB)
    // Create the Forum Post for the event to show de information needed and tag all the assigned users to their roles
  }

  @On('guildScheduledEventUpdate')
  async onGuildScheduledEventUpdate(
    @Context() [event]: ContextOf<'guildScheduledEventUpdate'>,
  ) {
    // TODO - Check first if its on ST

    this.eventService.updateEvent(event);
  }

  @On('guildScheduledEventUserAdd')
  async onGuildScheduledEventUserAdd(
    @Context() [event, user]: ContextOf<'guildScheduledEventUserAdd'>,
  ) {
    // TODO - Check if the event is a SlotTracker Event (it must be on DB)
    // TODO - Check if user is assigned to a role in SlotTracker, if not, remove it from the event
  }

  @On('guildScheduledEventDelete')
  async onGuildScheduledEventUserDelete(
    @Context() [event]: ContextOf<'guildScheduledEventDelete'>,
  ) {
    // We cannot prevent it from deleting the discord event
    // TODO - Add a 'Cancelled' on the end of the Forum Post title
    this.eventService.deleteEvent(event.id);
  }

  @On('guildScheduledEventUserRemove')
  async onGuildScheduledEventUserRemove(
    @Context() [event, user]: ContextOf<'guildScheduledEventUserRemove'>,
  ) {
    // TODO - Check if the event is a SlotTracker Event (it must be on DB)
    // TODO - Check if user is assigned to a role in SlotTracker, if not, remove it from the event
  }
}
