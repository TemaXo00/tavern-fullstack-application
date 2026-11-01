import { Module } from '@nestjs/common'

import { EventController } from './controllers/event.controller'
import { ParticipantController } from './controllers/participant.controller'
import { TagController } from './controllers/tag.controller'

@Module({
  controllers: [TagController, EventController, ParticipantController],
})
export class LogEventHandlerModule {}
