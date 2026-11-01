import { Module } from '@nestjs/common'

import { ArticleController } from './controllers/article.controller'
import { TagController } from './controllers/tag.controller'

@Module({
  controllers: [TagController, ArticleController],
})
export class LogBlogHandlerModule {}
