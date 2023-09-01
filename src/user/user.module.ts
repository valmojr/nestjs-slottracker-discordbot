import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [UserService, DatabaseService],
})
export class UserModule {}
