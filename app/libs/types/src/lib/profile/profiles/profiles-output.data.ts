import { PaginationBaseOutput } from '../../shared/pagination.type.js';

export interface ProfileBaseOutput {
  nickname: string;
  name?: string;
  surname?: string;
  description?: string;
  avatarId?: string;
  reputationScore: number;
  currentActivity: number;
}

export interface ProfileAdvancedOutput extends ProfileBaseOutput {
  id: string;
  userId: string;
  birthDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileListOutput {
  nickname: string;
  avatarId?: string;
  currentActivity: number;
}

export type ProfilePaginationBaseOutput = PaginationBaseOutput;
export interface ProfilePaginationAdvancedOutput extends ProfilePaginationBaseOutput {
  email?: string;
  birthDateFrom?: Date;
  birthDateTo: Date;
  reputationFrom?: number;
  reputationTo?: number;
  currentActivity?: number;
}

export interface PaginatedProfilesBaseOutput {
  pagination: ProfilePaginationBaseOutput;
  profiles: ProfileListOutput[];
}

export interface PaginatedProfilesAdvancedOutput {
  pagination: ProfilePaginationAdvancedOutput;
  profiles: ProfileListOutput[];
}
