import { Module } from '@nestjs/common';
import { AuthAuthorizationCoreModule } from '@org/auth-authorization-core';
import { AuthAuthorizationUtilsModule } from '@org/auth-authorization-utils';

import { AuthUserFeatureController } from './auth-user-feature.controller';
import { AuthUserFeatureService } from './auth-user-feature.service';

@Module({
  imports: [AuthAuthorizationCoreModule, AuthAuthorizationUtilsModule],
  controllers: [AuthUserFeatureController],
  providers: [AuthUserFeatureService],
})
export class AuthUserFeatureModule {}
