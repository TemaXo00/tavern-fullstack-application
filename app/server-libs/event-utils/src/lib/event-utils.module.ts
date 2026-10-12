import { Global, Module } from '@nestjs/common';

export const UTILS = [];

@Global()
@Module({
  providers: [...UTILS],
  exports: [...UTILS],
})
export class EventUtilsModule {}
