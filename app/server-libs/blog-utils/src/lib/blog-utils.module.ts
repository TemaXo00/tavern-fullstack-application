import { Global, Module } from '@nestjs/common'
import { BlogDatabaseModule } from '@org/blog-database'

import { BlogDatabaseUtil } from './utils/database.util'
import { BlogValidationUtil } from './utils/validation.util'

const UTILS = [BlogDatabaseUtil, BlogValidationUtil]

@Global()
@Module({
  imports: [BlogDatabaseModule],
  providers: [...UTILS],
  exports: [...UTILS],
})
export class BlogUtilsModule {}
