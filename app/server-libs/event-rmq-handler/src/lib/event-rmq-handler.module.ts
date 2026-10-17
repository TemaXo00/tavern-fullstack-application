import { Module } from '@nestjs/common';

import { AUTH_CONTROLLERS, AUTH_SERVICES } from './auth/main';

@Module({
  controllers: [...AUTH_CONTROLLERS],
  providers: [...AUTH_SERVICES],
})
export class EventRmqHandlerModule {}
