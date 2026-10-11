import { Global, Module } from '@nestjs/common';
import { AuthAuthorizationUtilsModule } from '@org/auth-authorization-utils';
import { SharedUtilsModule } from '@org/shared-utils';

import { AuthValidateService } from './auth-validate.service';

@Global()
@Module({
  imports: [SharedUtilsModule, AuthAuthorizationUtilsModule],
  providers: [AuthValidateService],
  exports: [AuthValidateService],
})
export class AuthAuthorizationCoreModule {}
