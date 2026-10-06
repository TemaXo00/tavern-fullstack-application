import { BaseUpdateProfileInput } from '@org/types';

import { BirthDate } from '../../decorators/profile/birth-date.decorator.js';
import { Description } from '../../decorators/profile/description.decorator.js';
import { Name } from '../../decorators/profile/name.decorator.js';
import { Nickname } from '../../decorators/profile/nickname.decorator.js';
import { Surname } from '../../decorators/profile/surname.decorator.js';
import { Id } from '../../decorators/shared/id.decorator.js';

export class UpdateProfileDto implements BaseUpdateProfileInput {
  @Nickname()
  nickname?: string;

  @Name()
  name?: string;

  @Surname()
  surname?: string;

  @Description()
  description?: string;

  @BirthDate(false)
  birthDate?: Date;

  @Id(false)
  avatarId?: string;
}
