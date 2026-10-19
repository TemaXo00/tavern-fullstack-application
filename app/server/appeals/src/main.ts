import { microservice } from '@org/nest-launcher'

import { AppModule } from './app.module'

microservice<AppModule>({
  scope: 'TAVERN',
  name: 'Appeals',
  module: AppModule,
  logs: true,
  rabbitMQ: true,
})
