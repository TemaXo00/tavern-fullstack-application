import { microservice } from '@org/nest-launcher'

import { AppModule } from './app.module'

microservice<AppModule>({
  scope: 'TAVERN',
  name: 'Event',
  module: AppModule,
  logs: true,
  grpc: true,
  rabbitMQ: true,
})
