import { Module } from '@nestjs/common';
import { AuthAuthorizationUtilsModule } from '@org/auth-authorization-utils';

import { AuthAuthorizationFeatureController } from './auth-authorization-feature.controller';
import { AuthAuthorizationFeatureService } from './auth-authorization-feature.service';

@Module({
  imports: [AuthAuthorizationUtilsModule],
  controllers: [AuthAuthorizationFeatureController],
  providers: [AuthAuthorizationFeatureService],
})
export class AuthAuthorizationFeatureModule {}
