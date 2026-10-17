import { Module } from '@nestjs/common'

import { AUTH_CONTROLLERS, AUTH_SERVICES } from './auth/main'
import { PROFILE_CONTROLLERS, PROFILE_SERVICES } from './profile/main'

@Module({
  controllers: [...AUTH_CONTROLLERS, ...PROFILE_CONTROLLERS],
  providers: [...AUTH_SERVICES, ...PROFILE_SERVICES],
})
export class EventRmqHandlerModule {}
