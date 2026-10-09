import { microserviceLaunch } from '@org/bootstrap';

import { AppModule } from './app.module';

void microserviceLaunch<AppModule>({
  name: 'Chat',
  module: AppModule,
  logs: true,
  rmq: true,
});
