import { Module } from '@nestjs/common'
import { AuthAuthorizationUtilsModule } from '@org/auth-authorization-utils'

import { AuthSessionFeatureController } from './auth-session-feature.controller'
import { AuthSessionFeatureService } from './auth-session-feature.service'

@Module({
  imports: [AuthAuthorizationUtilsModule],
  controllers: [AuthSessionFeatureController],
  providers: [AuthSessionFeatureService],
})
export class AuthSessionFeatureModule {}
