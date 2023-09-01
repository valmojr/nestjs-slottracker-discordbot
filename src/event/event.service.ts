import { Injectable } from '@nestjs/common';
import { Event } from '@prisma/client';
import { GuildScheduledEvent, GuildScheduledEventStatus } from 'discord.js';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class EventService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createEvent(event: GuildScheduledEvent<GuildScheduledEventStatus>) {
    return this.databaseService.event.create({
      data: {
        id: event.id,
        guildId: event.guild.id,
        title: event.name,
        description: event.description,
        thumbnail: event.image,
        starts_at: event.scheduledStartAt,
        ends_at: event.scheduledEndAt,
        created_at: event.createdAt,
        updated_at: new Date(event.createdAt),
      },
    });
  }

  async updateEvent(event: GuildScheduledEvent<GuildScheduledEventStatus>) {
    return this.databaseService.event.update({
      data: {
        id: event.id,
        guildId: event.guild.id,
        title: event.name,
        description: event.description,
        thumbnail: event.image,
        starts_at: event.scheduledStartAt,
        ends_at: event.scheduledEndAt,
        created_at: event.createdAt,
        updated_at: new Date(event.createdAt),
      },
      where: {
        id: event.id,
      },
    });
  }
  async deleteEvent(eventOrEventId: Event | string) {
    typeof eventOrEventId === 'string'
      ? this.databaseService.event.delete({ where: { id: eventOrEventId } })
      : this.databaseService.event.delete({ where: { id: eventOrEventId.id } });
  }
}
