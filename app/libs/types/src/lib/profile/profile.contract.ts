import type { PaginatedActivityOutput } from './activity/activity-output.data.js';
import type { ToObservable } from '../utils/to-observable.js';
import type {
  GetActivityByNicknameInput,
  GetMyActivityInput,
} from './activity/activity-input.data.js';
import type {
  GetMeInput,
  GetProfileByNicknameAdvancedInput,
  GetProfileByNicknameBaseInput,
  GetProfilesAdvancedInput,
  GetProfilesInput,
  UpdateProfileInput,
} from './profiles/profiles-input.data.js';
import type {
  PaginatedProfilesAdvancedOutput,
  PaginatedProfilesBaseOutput,
  ProfileAdvancedOutput,
  ProfileBaseOutput,
} from './profiles/profiles-output.data.js';
import type {
  GetMyReputationInput,
  GetReputationByNicknameInput,
} from './reputation/reputation-input.data.js';
import type { PaginatedReputationOutput } from './reputation/reputation-output.data.js';

export interface ProfileServiceContract {
  GetMe(data: GetMeInput): Promise<ProfileAdvancedOutput>;
  GetProfileByNicknameBase(
    data: GetProfileByNicknameBaseInput,
  ): Promise<ProfileBaseOutput>;
  GetProfileByNicknameAdvanced(
    data: GetProfileByNicknameAdvancedInput,
  ): Promise<ProfileAdvancedOutput>;
  GetProfilesBase(data: GetProfilesInput): Promise<PaginatedProfilesBaseOutput>;
  GetProfilesAdvanced(
    data: GetProfilesAdvancedInput,
  ): Promise<PaginatedProfilesAdvancedOutput>;
  UpdateProfile(data: UpdateProfileInput): Promise<ProfileAdvancedOutput>;
}

export interface ActivityServiceContract {
  GetMyLogs(data: GetMyActivityInput): Promise<PaginatedActivityOutput>;
  GetActivityByNickname(
    data: GetActivityByNicknameInput,
  ): Promise<PaginatedActivityOutput>;
}

export interface ReputationServiceContract {
  GetMyLogs(data: GetMyReputationInput): Promise<PaginatedReputationOutput>;
  GetReputationByNickname(
    data: GetReputationByNicknameInput,
  ): Promise<PaginatedReputationOutput>;
}

export type ProfileServiceObservableContract =
  ToObservable<ProfileServiceContract>;
