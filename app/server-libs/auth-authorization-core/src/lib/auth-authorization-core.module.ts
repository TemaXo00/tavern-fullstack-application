import { Global, Module } from '@nestjs/common';
import { AuthAuthorizationUtilsModule } from '@org/auth-authorization-utils';

import { AuthValidateService } from './auth-validate.service';

@Global()
@Module({
  imports: [AuthAuthorizationUtilsModule],
  providers: [AuthValidateService],
  exports: [AuthValidateService],
})
export class AuthAuthorizationCoreModule {}
