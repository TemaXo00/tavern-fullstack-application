import { CreateEventSharedInput } from '@org/shared-types'

import { EventDate } from '../../decorators/event/event-date.decorator.js'
import { EventPlaces } from '../../decorators/event/event-places.decorator.js'
import { EventTags } from '../../decorators/event/event-tags.decorator.js'
import { Description } from '../../decorators/shared/description.decorator.js'
import { Name } from '../../decorators/shared/name.decorator.js'

export class CreateEventDto implements CreateEventSharedInput {
  @Name()
  name: string
  @Description()
  description?: string
  @EventDate(true)
  dateAndTime: Date
  @EventPlaces(true)
  totalPlaces: number
  @EventTags()
  tags: string[]
}
