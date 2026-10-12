import { CreateEventTagSharedInput } from '@org/shared-types';

import { Color } from '../../decorators/event/color.decorator.js';
import { Description } from '../../decorators/shared/description.decorator.js';
import { Name } from '../../decorators/shared/name.decorator.js';

export class CreateEventTagDto implements CreateEventTagSharedInput {
  @Name()
  name: string;
  @Description()
  description?: string;
  @Color()
  color?: string;
}
