import { UpdateEventTagSharedInput } from '@org/shared-types'

import { Color } from '../../decorators/event/color.decorator.js'
import { Description } from '../../decorators/shared/description.decorator.js'

export class UpdateEventTagDto implements UpdateEventTagSharedInput {
  @Description(false)
  description?: string
  @Color()
  color?: string
}
