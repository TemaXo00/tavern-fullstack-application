import { DeleteOtherEventSharedInput } from '@org/shared-types'

import { EventMessage } from '../../decorators/event/event-message.decorator.js'

export class DeleteOtherEventDto implements DeleteOtherEventSharedInput {
  @EventMessage()
  message: string
}
