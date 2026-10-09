import { PaginationBaseInput } from '../../shared/pagination.type.js';

export type ProfilePaginationBaseBaseInput = PaginationBaseInput;
export interface ProfilePaginationAdvancedBaseInput extends ProfilePaginationBaseBaseInput {
  email?: string;
  birthDateFrom?: Date;
  birthDateTo?: Date;
  reputationFrom?: number;
  reputationTo?: number;
  currentActivity?: number;
}
export interface GetProfileByNicknameBaseInput {
  nickname: string;
}

export interface UpdateProfileBaseRequestInput {
  nickname?: string;
  name?: string;
  surname?: string;
  description?: string;
  birthDate?: Date;
  avatarId?: string;
}

export interface GetProfilesBaseInput {
  pagination: ProfilePaginationBaseBaseInput;
}

export interface GetProfilesAdvancedBaseInput {
  pagination: ProfilePaginationAdvancedBaseInput;
}

export interface UpdateProfileBaseInput {
  data: UpdateProfileBaseRequestInput;
}
