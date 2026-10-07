import { microserviceLaunch } from '@org/bootstrap';

import { AppModule } from './app.module';

void microserviceLaunch<AppModule>({
  name: 'File',
  module: AppModule,
  logs: true,
  rmq: true,
});
