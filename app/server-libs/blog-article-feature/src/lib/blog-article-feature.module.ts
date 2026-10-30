import { Module } from '@nestjs/common'

import { BlogArticleFeatureController } from './blog-article-feature.controller'
import { BlogArticleFeatureService } from './blog-article-feature.service'

@Module({
  controllers: [BlogArticleFeatureController],
  providers: [BlogArticleFeatureService],
})
export class BlogArticleFeatureModule {}
