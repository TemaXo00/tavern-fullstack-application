import {
  BlockUserBaseInput,
  ChangeEmailBaseInput,
  ChangePasswordBaseInput,
  UserDeleteBaseInput,
  UserPaginationBaseInput,
} from '@org/base-types';
import { Roles } from '@org/enums';

import { Replace } from '../../utils/replace.js';

export type BlockUserSharedInput = BlockUserBaseInput;
export type ChangePasswordSharedInput = ChangePasswordBaseInput;
export type ChangeEmailSharedInput = ChangeEmailBaseInput;
export type UserDeleteSharedInput = UserDeleteBaseInput;
export type UserPaginationSharedInput = Replace<
  UserPaginationBaseInput,
  { role?: Roles }
>;
