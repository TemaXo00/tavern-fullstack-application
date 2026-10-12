import { BirthDate } from '../../decorators/profile/birth-date.decorator.js';
import { Nickname } from '../../decorators/profile/nickname.decorator.js';
import { Surname } from '../../decorators/profile/surname.decorator.js';
import { Description } from '../../decorators/shared/description.decorator.js';
import { Id } from '../../decorators/shared/id.decorator.js';
import { Name } from '../../decorators/shared/name.decorator.js';

import type { UpdateProfileSharedInput } from '@org/shared-types';

export class UpdateProfileDto implements UpdateProfileSharedInput {
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
