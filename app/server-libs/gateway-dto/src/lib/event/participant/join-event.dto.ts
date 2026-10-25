import { JoinEventSharedInput } from '@org/shared-types'

import { EventNote } from '../../decorators/event/note.decorator.js'

export class JoinEventDto implements JoinEventSharedInput {
  @EventNote()
  note?: string
}
