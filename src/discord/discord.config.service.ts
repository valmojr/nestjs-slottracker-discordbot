import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { IntentsBitField } from 'discord.js';
import { NecordModuleOptions } from 'necord/dist/necord-options.interface';

@Injectable()
export class DiscordConfigService {
  createNecordOptions(): NecordModuleOptions {
    return {
      token: process.env.DISCORD_BOT_TOKEN,
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildModeration,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.AutoModerationConfiguration,
        IntentsBitField.Flags.AutoModerationExecution,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildScheduledEvents,
        IntentsBitField.Flags.DirectMessages,
      ],
      prefix: '!',
      development: [process.env.DISCORD_DEV_GUILD_ID],
    };
  }
}
