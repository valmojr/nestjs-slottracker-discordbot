import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { Guild } from 'discord.js';
import { Guild as ClientGuild } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class GuildService {
  constructor(private readonly databaseService: DatabaseService) {}
  private readonly logger = new Logger(GuildService.name);

  async fetchUsers(guild: Guild): Promise<User[]> {
    this.logger.log(`Fetching Guild ${guild.name} members`);

    await guild.members.fetch();

    const guildMembers = guild.members.cache;

    return guildMembers.map(({ user }) => {
      const { id, username, avatar } = user;

      return {
        id,
        username,
        avatar,
        accessToken: undefined,
        refreshToken: undefined,
      };
    });
  }

  async createGuild(guild: Guild): Promise<ClientGuild> {
    this.logger.warn(`Guild ${guild.name} just added SlotTracker!`);

    const { id, name, description, icon } = guild;

    return await this.databaseService.guild.create({
      data: {
        id,
        name,
        description,
        icon,
      },
    });
  }

  async find(guildOrGuildId: string | Guild) {
    if (typeof guildOrGuildId === 'string') {
      return this.databaseService.guild.findUnique({
        where: { id: guildOrGuildId },
      });
    } else {
      return this.databaseService.guild.findUnique({
        where: { id: guildOrGuildId.id },
      });
    }
  }

  async removeGuild({ id, name }: Guild): Promise<ClientGuild> {
    this.logger.warn(`Guild ${name} just removed SlotTracker!`);
    return await this.databaseService.guild.delete({ where: { id } });
  }

  async getAvaliableGuildsFromUser(id: string) {
    return await this.databaseService.guild.findMany({
      where: { members: { every: { id } } },
    });
  }
}
