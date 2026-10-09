import { microserviceLaunch } from '@org/bootstrap';

import { AppModule } from './app.module';

microserviceLaunch<AppModule>({
  name: 'Appeals',
  module: AppModule,
  logs: true,
  rmq: true,
});
