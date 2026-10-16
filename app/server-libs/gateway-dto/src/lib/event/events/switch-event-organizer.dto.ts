import { SwitchEventOrganizerSharedInput } from '@org/shared-types';

import { Nickname } from '../../decorators/shared/nickname.decorator.js';

export class SwitchEventOrganizerDto implements SwitchEventOrganizerSharedInput {
  @Nickname()
  organizerNickname: string;
}
