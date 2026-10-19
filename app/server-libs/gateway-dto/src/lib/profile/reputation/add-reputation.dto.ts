import { AddReputationSharedInput } from '@org/shared-types'

import { ReputationMessage } from '../../decorators/profile/message.decorator.js'
import { ReputationScore } from '../../decorators/profile/score.decorator.js'

export class AddReputationDto implements AddReputationSharedInput {
  @ReputationScore()
  score: number
  @ReputationMessage()
  message: string
}
