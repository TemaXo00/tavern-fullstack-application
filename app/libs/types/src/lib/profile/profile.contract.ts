import { ToObservable } from '../utils/to-observable.js';

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

export type ProfileServiceObservableContract =
  ToObservable<ProfileServiceContract>;
