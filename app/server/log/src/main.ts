import { microservice } from '@org/nest-launcher'

import { AppModule } from './app.module'

microservice<AppModule>({
  scope: 'TAVERN',
  name: 'Log',
  module: AppModule,
  logs: true,
  grpc: true,
  rabbitMQ: true,
})
