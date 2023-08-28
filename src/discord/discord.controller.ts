import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { MessageCreateOptions, MessagePayload } from 'discord.js';

@Controller('discord')
export class DiscordController {
  @Post('sendmessage')
  sendMessage(@Body() message: string | MessagePayload | MessageCreateOptions) {
    return {
      status: HttpStatus.ACCEPTED,
      message,
    };
  }
}
