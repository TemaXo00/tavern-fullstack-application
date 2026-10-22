import { RemoveUserFromEventSharedInput } from '@org/shared-types'

import { Nickname } from '../../decorators/shared/nickname.decorator.js'

export class DeleteParticipantDto implements RemoveUserFromEventSharedInput {
  @Nickname()
  nickname: string
}
