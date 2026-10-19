import { microservice } from '@org/nest-launcher'

import { AppModule } from './app.module'

microservice<AppModule>({
  scope: 'TAVERN',
  name: 'File',
  module: AppModule,
  logs: true,
  rabbitMQ: true,
})
