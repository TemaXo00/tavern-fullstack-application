import { AddUserToEventSharedInput } from '@org/shared-types'

import { EventNote } from '../../decorators/event/note.decorator.js'
import { Nickname } from '../../decorators/shared/nickname.decorator.js'

export class AddParticipantDto implements AddUserToEventSharedInput {
  @Nickname()
  nickname: string

  @EventNote()
  note?: string
}
