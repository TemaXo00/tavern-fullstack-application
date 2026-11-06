import type { PaginatedActivityOutput } from './activity/activity-output.data.js'
import type { ToObservable } from '../utils/to-observable.js'
import type { GetActivityByNicknameInput, GetMyActivityInput } from './activity/activity-input.data.js'
import type {
  GetMeInput,
  GetProfileByNicknameAdvancedInput,
  GetProfileByNicknameInput,
  GetProfilesAdvancedInput,
  GetProfilesInput,
  UpdateProfileInput,
} from './profiles/profiles-input.data.js'
import type {
  PaginatedProfilesAdvancedOutput,
  PaginatedProfilesBaseOutput,
  ProfileAdvancedOutput,
  ProfileBaseOutput,
} from './profiles/profiles-output.data.js'
import type {
  AddReputationInput,
  GetMyReputationInput,
  GetReputationByNicknameInput,
} from './reputation/reputation-input.data.js'
import type { PaginatedReputationOutput, ReputationOutput } from './reputation/reputation-output.data.js'
import type {
  CreateSocialInput,
  DeleteSocialInput,
  GetMySocialsInput,
  GetOtherUserSocialsInput,
} from './socials/socials-input.data.js'
import type { AllSocialsOutput, SocialOutput } from './socials/socials-output.data.js'
import type { Empty } from '../shared/empty.type.js'

export interface ProfileServiceContract {
  GetMe(data: GetMeInput): Promise<ProfileAdvancedOutput>
  GetProfileByNicknameBase(data: GetProfileByNicknameInput): Promise<ProfileBaseOutput>
  GetProfileByNicknameAdvanced(data: GetProfileByNicknameAdvancedInput): Promise<ProfileAdvancedOutput>
  GetProfilesBase(data: GetProfilesInput): Promise<PaginatedProfilesBaseOutput>
  GetProfilesAdvanced(data: GetProfilesAdvancedInput): Promise<PaginatedProfilesAdvancedOutput>
  UpdateProfile(data: UpdateProfileInput): Promise<ProfileAdvancedOutput>
}

export interface ActivityServiceContract {
  GetMyLogs(data: GetMyActivityInput): Promise<PaginatedActivityOutput>
  GetActivityByNickname(data: GetActivityByNicknameInput): Promise<PaginatedActivityOutput>
}

export interface ReputationServiceContract {
  GetMyLogs(data: GetMyReputationInput): Promise<PaginatedReputationOutput>
  GetReputationByNickname(data: GetReputationByNicknameInput): Promise<PaginatedReputationOutput>
  AddReputation(data: AddReputationInput): Promise<ReputationOutput>
}

export interface SocialServiceContract {
  GetMySocials(data: GetMySocialsInput): Promise<AllSocialsOutput>
  GetSocialsByNickname(data: GetOtherUserSocialsInput): Promise<AllSocialsOutput>
  CreateSocial(data: CreateSocialInput): Promise<SocialOutput>
  DeleteSocial(data: DeleteSocialInput): Promise<Empty>
}

export type ProfileServiceObservableContract = ToObservable<ProfileServiceContract>
export type ReputationServiceObservableContract = ToObservable<ReputationServiceContract>
export type ActivityServiceObservableContract = ToObservable<ActivityServiceContract>
export type SocialServiceObservableContract = ToObservable<SocialServiceContract>
