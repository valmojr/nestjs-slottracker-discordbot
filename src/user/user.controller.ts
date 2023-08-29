import { Controller, Get, Param } from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Controller('user')
export class UserController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get(':id')
  async getUserByDiscordId(@Param('id') id: string): Promise<User> {
    return await this.databaseService.user.findUnique({ where: { id } });
  }
}
