import { Injectable } from '@nestjs/common';
import { User, Guild as ClientGuild } from '@prisma/client';
import {
  Guild,
  GuildMember,
  PartialGuildMember,
  User as DiscordUser,
} from 'discord.js';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createOrUpdateGuildMember({
    id,
    nickname,
    avatar,
  }: GuildMember): Promise<User> {
    const existingUser = this.databaseService.user.findUnique({
      where: { id },
    });

    return existingUser
      ? this.databaseService.user.update({
          data: { id, username: nickname, avatar },
          where: { id },
        })
      : this.databaseService.user.create({
          data: { id, username: nickname, avatar },
        });
  }

  async createOrUpdateUser({
    id,
    username,
    avatar,
  }: User | DiscordUser): Promise<User> {
    const existingUser = this.databaseService.user.findUnique({
      where: { id },
    });

    return existingUser
      ? this.databaseService.user.update({
          data: { id, username, avatar },
          where: { id },
        })
      : this.databaseService.user.create({
          data: { id, username, avatar },
        });
  }

  async addGuildMemberToGuild(
    { id, nickname, avatar }: GuildMember,
    guild: Guild,
  ): Promise<ClientGuild> {
    return await this.databaseService.guild.update({
      data: {
        members: {
          connectOrCreate: {
            where: { id },
            create: { id, username: nickname, avatar },
          },
        },
      },
      where: { id: guild.id },
    });
  }

  async removeGuildMemberFromGuild(
    { id }: GuildMember | PartialGuildMember,
    guild: Guild,
  ): Promise<ClientGuild> {
    return this.databaseService.guild.update({
      data: {
        members: {
          disconnect: { id },
        },
      },
      where: {
        id: guild.id,
      },
    });
  }

  async addUserToGuild(
    { id, username, avatar }: User,
    guild: Guild,
  ): Promise<ClientGuild> {
    return await this.databaseService.guild.update({
      data: {
        members: {
          connectOrCreate: {
            where: { id },
            create: { id, username, avatar },
          },
        },
      },
      where: { id: guild.id },
    });
  }

  async removeUserFromGuild({ id }: User, guild: Guild): Promise<ClientGuild> {
    return this.databaseService.guild.update({
      data: {
        members: {
          disconnect: { id },
        },
      },
      where: {
        id: guild.id,
      },
    });
  }
}
