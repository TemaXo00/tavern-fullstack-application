import { ActivityType } from '../../enums/profile.enum.js';
import { PaginationBaseInput } from '../../shared/pagination.type.js';
import { Protected } from '../../utils/protected.js';

export type ProfilePaginationBaseInput = PaginationBaseInput;
export interface ProfilePaginationAdvancedInput extends ProfilePaginationBaseInput {
  email?: string;
  birthDateFrom?: Date;
  birthDateTo?: Date;
  reputationFrom?: number;
  reputationTo?: number;
  currentActivity?: ActivityType;
}

export type GetMeInput = Protected<null>;

export interface GetProfilesInput {
  pagination: ProfilePaginationBaseInput;
}

export type GetProfilesAdvancedInput = Protected<{
  pagination: ProfilePaginationAdvancedInput;
}>;

export interface GetProfileByNicknameBaseInput {
  nickname: string;
}

export type GetProfileByNicknameAdvancedInput =
  Protected<GetProfileByNicknameBaseInput>;

export interface BaseUpdateProfileInput {
  nickname?: string;
  name?: string;
  surname?: string;
  description?: string;
  birthDate?: Date;
  avatarId?: string;
}

export type UpdateProfileInput = Protected<{ data: BaseUpdateProfileInput }>;
