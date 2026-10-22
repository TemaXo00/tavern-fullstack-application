import { microservice } from '@org/nest-launcher'

import { AppModule } from './app.module'

microservice<AppModule>({
  scope: 'TAVERN',
  name: 'Blog',
  module: AppModule,
  logs: true,
  grpc: true,
  rabbitMQ: true,
})
