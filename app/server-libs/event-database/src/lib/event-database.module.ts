import { Module } from '@nestjs/common';

import { EventDatabaseService } from './event-database.service';

@Module({
  controllers: [],
  providers: [EventDatabaseService],
  exports: [EventDatabaseService],
})
export class EventDatabaseModule {}
