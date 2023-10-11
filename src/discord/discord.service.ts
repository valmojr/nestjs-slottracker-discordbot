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
    this.logger.log(`Event ${event.name} created in Guild ${event.guild.name}`);
    // Just won't be logged when i create a event
    const databaseEvent = !!this.eventService.findEvent(event);
    if (!databaseEvent) {
      this.eventService.createEvent(event);
    }
  }

  @On('guildScheduledEventUpdate')
  async onGuildScheduledEventUpdate(
    @Context() [event]: ContextOf<'guildScheduledEventUpdate'>,
  ) {
    const databaseEvent = !!this.eventService.findEvent(event);
    if (databaseEvent) {
      this.eventService.updateEvent(event);
    }
  }

  @On('guildScheduledEventUserAdd')
  async onGuildScheduledEventUserAdd(
    @Context() [event, user]: ContextOf<'guildScheduledEventUserAdd'>,
  ) {
    const databaseEvent = !!this.eventService.findEvent(event);
    const databaseUser = !!this.userService.findGuildMemberOnGuild(
      user,
      await this.guildService.find(event.guild),
    );

    if (!databaseEvent) {
      const message = `Event ${event.name} was not found in the Database`;
      this.logger.warn(message);
      throw new Error(message);
    }
    if (!databaseUser) {
      const message = `User ${user.globalName} was not found in the Database`;
      this.logger.warn(message);
      throw new Error(message);
    }

    // TODO - Add "You are not assigned to any role in this event, you can assign yourself on XXX"/"This event is fully sloted"
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
    const databaseEvent = !!this.eventService.findEvent(event);
    const databaseUser = !!this.userService.findGuildMemberOnGuild(
      user,
      await this.guildService.find(event.guild),
    );
    if (!databaseEvent) {
      const message = `Event ${event.name} was not found in the Database`;
      this.logger.warn(message);
      throw new Error(message);
    }
    if (!databaseUser) {
      const message = `User ${user.globalName} was not found in the Database`;
      this.logger.warn(message);
      throw new Error(message);
    }
    // TODO - Check if user is assigned to a role in SlotTracker, if not, remove it from the event
  }
}
