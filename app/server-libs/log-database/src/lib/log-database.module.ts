import { Module } from '@nestjs/common';

import { LogDatabaseService } from './log-database.service';

@Module({
  controllers: [],
  providers: [LogDatabaseService],
  exports: [LogDatabaseService],
})
export class LogDatabaseModule {}
