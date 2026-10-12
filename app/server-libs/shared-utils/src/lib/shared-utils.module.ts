import { Module } from '@nestjs/common';

import { DateMapUtil } from './utils/date-map.util';
import { PaginationUtil } from './utils/pagination.util';
import { RmqLoggerUtil } from './utils/rmq-logger.util';
import { SlugUtil } from './utils/slug.util';
import { StringValidationUtil } from './utils/string-validation.util';

const UTILS = [
  PaginationUtil,
  StringValidationUtil,
  DateMapUtil,
  RmqLoggerUtil,
  SlugUtil,
];

@Module({
  controllers: [],
  providers: [...UTILS],
  exports: [...UTILS],
})
export class SharedUtilsModule {}
