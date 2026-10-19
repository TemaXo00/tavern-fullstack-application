import { monolith } from '@org/nest-launcher'

import { AppModule } from './app.module'

void monolith<AppModule>({
  scope: 'TAVERN',
  name: 'Gateway',
  module: AppModule,
  logs: true,
  prefix: true,
  validation: true,
  responseMap: true,
  rateLimit: true,
  errorMap: true,
  cookie: true,
  cors: false,
  swagger: true,
  compression: true,
})
