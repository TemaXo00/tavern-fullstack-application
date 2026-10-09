import { SessionLocalNameSharedInput } from '@org/shared-types';

import { LocalName } from '../../decorators/auth/local-name.decorator.js';

export class LocalNameDto implements SessionLocalNameSharedInput {
  @LocalName()
  localName: string;
}
