import { GETMethod, HTTPController } from '@org/gateway-decorators';

@HTTPController({
  microserviceName: 'Event',
  serviceName: 'Event',
})
export class EventController {
  @GETMethod({
    path: '',
    operationDesc: 'Get test',
  })
  getTest(): string {
    return 'test';
  }
}
