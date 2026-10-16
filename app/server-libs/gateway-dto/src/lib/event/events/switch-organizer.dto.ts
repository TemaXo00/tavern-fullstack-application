import { SwitchEventOrganizerSharedInput } from '@org/shared-types';

import { Nickname } from '../../decorators/shared/nickname.decorator.js';

export class SwitchOrganizerDto implements SwitchEventOrganizerSharedInput {
  @Nickname()
  organizerNickname: string;
}
