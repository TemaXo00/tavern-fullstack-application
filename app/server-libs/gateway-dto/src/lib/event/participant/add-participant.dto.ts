import { AddUserToEventSharedInput } from '@org/shared-types'

import { Nickname } from '../../decorators/shared/nickname.decorator.js'

export class AddParticipantDto implements AddUserToEventSharedInput {
  @Nickname()
  nickname: string
}
