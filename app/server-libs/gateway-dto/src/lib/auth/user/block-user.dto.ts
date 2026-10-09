import { BlockReason } from '../../decorators/auth/block-reason.decorator.js';
import { BlockedUntil } from '../../decorators/auth/blocked-until.decorator.js';

import type { BlockUserSharedInput } from '@org/shared-types';

export class BlockUserDto implements BlockUserSharedInput {
  @BlockReason()
  blockReason: string;
  @BlockedUntil()
  blockedUntil: Date;
}
