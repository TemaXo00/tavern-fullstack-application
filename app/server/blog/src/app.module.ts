import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthAuthorizationCoreModule } from '@org/auth-authorization-core'
import { BlogArticleFeatureModule } from '@org/blog-article-feature'
import { BlogRmqHandlerModule } from '@org/blog-rmq-handler'
import { BlogTagFeatureModule } from '@org/blog-tag-feature'
import { BlogUtilsModule } from '@org/blog-utils'
import { SharedUtilsModule } from '@org/shared-utils'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthAuthorizationCoreModule,
    SharedUtilsModule,
    BlogUtilsModule,
    BlogArticleFeatureModule,
    BlogRmqHandlerModule,
    BlogTagFeatureModule
  ],
})
export class AppModule {}
