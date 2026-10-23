import { Module } from '@nestjs/common';

import { BlogDatabaseService } from './blog-database.service';

@Module({
  controllers: [],
  providers: [BlogDatabaseService],
  exports: [BlogDatabaseService],
})
export class BlogDatabaseModule {}
