import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { Guild, GuildMember } from 'discord.js';
import { Guild as ClientGuild } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class GuildService {
  constructor(private readonly databaseService: DatabaseService) {}
  private readonly logger = new Logger(GuildService.name);

  async fetchUsers(guild: Guild): Promise<User[]> {
    this.logger.log(`Fetching Guild ${guild.name} members`);

    const guildMembers = await guild.members.fetch();

    return guildMembers.map((member) => {
      return {
        id: member.id,
        username: member.nickname,
        avatar: member.avatar,
        accessToken: undefined,
        refreshToken: undefined,
      };
    });
  }

  async upsertMembers(guild: Guild) {
    this.logger.log(`Upserting Guild ${guild.name}`);

    const guildUsers = await this.fetchUsers(guild);

    return guildUsers.map(({ id, username, avatar }) =>
      this.databaseService.user.upsert({
        create: {
          id,
          username,
          avatar,
        },
        update: { username, avatar },
        where: { id },
      }),
    );
  }

  async createGuild(guild: Guild): Promise<ClientGuild> {
    this.logger.warn(`Guild ${Guild.name} just added SlotTracker!`);

    const guildMembers = await this.fetchUsers(guild);

    const { id, name, banner } = guild;

    return await this.databaseService.guild.create({
      data: {
        id,
        name,
        thumbnail: banner,
        members: {
          create: guildMembers,
        },
      },
    });
  }

  async removeGuild({ id }: Guild): Promise<ClientGuild> {
    this.logger.warn(`Guild ${Guild.name} just removed SlotTracker!`);
    return await this.databaseService.guild.delete({ where: { id } });
  }

  async removeGuildMemberFromGuild(
    guildMember: GuildMember,
    guild: Guild,
  ): Promise<ClientGuild> {
    return this.databaseService.guild.update({
      data: {
        members: {
          delete: guildMember,
        },
      },
      where: {
        id: guild.id,
      },
    });
  }

  async addGuildMemberToGuild(
    guildMember: GuildMember,
    guild: Guild,
  ): Promise<ClientGuild> {
    const user = {
      id: guildMember.id,
      username: guildMember.nickname,
      avatar: guildMember.avatar,
    };

    return await this.databaseService.guild.update({
      data: {
        members: {
          create: user,
        },
      },
      where: { id: guild.id },
    });
  }
}
