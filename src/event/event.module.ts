import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [EventService, DatabaseService],
})
export class EventModule {}
