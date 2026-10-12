import { Global, Module } from '@nestjs/common';
import { EventDatabaseModule } from '@org/event-database';
import { SharedUtilsModule } from '@org/shared-utils';

import { EventDatabaseUtil } from './utils/database.util';

export const UTILS = [EventDatabaseUtil];

@Global()
@Module({
  imports: [EventDatabaseModule, SharedUtilsModule],
  providers: [...UTILS],
  exports: [...UTILS],
})
export class EventUtilsModule {}
