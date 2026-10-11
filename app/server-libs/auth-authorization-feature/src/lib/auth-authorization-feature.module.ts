import { Module } from '@nestjs/common';

import { AuthAuthorizationFeatureController } from './auth-authorization-feature.controller';
import { AuthAuthorizationFeatureService } from './auth-authorization-feature.service';

@Module({
  controllers: [AuthAuthorizationFeatureController],
  providers: [AuthAuthorizationFeatureService],
})
export class AuthAuthorizationFeatureModule {}
