import { Module } from '@nestjs/common'

import { BlogTagFeatureController } from './blog-tag-feature.controller'
import { BlogTagFeatureService } from './blog-tag-feature.service'

@Module({
  controllers: [BlogTagFeatureController],
  providers: [BlogTagFeatureService],
})
export class BlogTagFeatureModule {}
