import { Global, Module } from '@nestjs/common'
import { LogDatabaseModule } from '@org/log-database'

import { LogDatabaseUtil } from './log-database.util'

@Global()
@Module({
  imports: [LogDatabaseModule],
  providers: [LogDatabaseUtil],
  exports: [LogDatabaseUtil],
})
export class LogUtilModule {}
