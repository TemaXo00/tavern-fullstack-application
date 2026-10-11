import { Module } from '@nestjs/common';
import { AuthAuthorizationUtilsModule } from '@org/auth-authorization-utils';

import { AuthUserFeatureController } from './auth-user-feature.controller';
import { AuthUserFeatureService } from './auth-user-feature.service';

@Module({
  imports: [AuthAuthorizationUtilsModule],
  controllers: [AuthUserFeatureController],
  providers: [AuthUserFeatureService],
})
export class AuthUserFeatureModule {}
