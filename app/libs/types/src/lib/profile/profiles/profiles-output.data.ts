import { ActivityType } from '../../enums/profile.enum.js';
import { PaginationBaseOutput } from '../../shared/pagination.type.js';
import { Replace } from '../../utils/replace.js';

export interface ProfileBaseOutput {
  nickname: string;
  name: string | null;
  surname: string | null;
  description: string | null;
  avatarId: string | null;
  reputationScore: number;
  currentActivity: number;
}

export interface ProfileAdvancedOutput extends ProfileBaseOutput {
  id: string;
  userId: string;
  birthDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileListOutput {
  nickname: string;
  avatarId: string | null;
  currentActivity: number;
}

export type ProfilePaginationBaseOutput = PaginationBaseOutput;
export interface ProfilePaginationAdvancedOutput extends ProfilePaginationBaseOutput {
  email?: string;
  birthDateFrom?: Date;
  birthDateTo?: Date;
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

export type ProfileGatewayBaseOutput = Replace<
  ProfileBaseOutput,
  { currentActivity: ActivityType }
>;

export type ProfileGatewayAdvancedOutput = Replace<
  ProfileAdvancedOutput,
  { currentActivity: ActivityType }
>;

export type ProfileGatewayListOutput = Replace<
  ProfileListOutput,
  { currentActivity: ActivityType }
>;

export type ProfileGatewayPaginationBaseOutput = ProfilePaginationBaseOutput;

export type ProfileGatewayPaginationAdvancedOutput = Replace<
  ProfilePaginationAdvancedOutput,
  { currentActivity?: ActivityType }
>;

export type PaginatedProfilesGatewayBaseOutput = {
  pagination: ProfileGatewayPaginationBaseOutput;
  profiles: ProfileGatewayListOutput[];
};

export type PaginatedProfilesGatewayAdvancedOutput = {
  pagination: ProfileGatewayPaginationAdvancedOutput;
  profiles: ProfileGatewayListOutput[];
};
