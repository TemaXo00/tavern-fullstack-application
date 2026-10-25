import { PaginationBaseOutput } from '../../shared/pagination.type.js'

export interface ProfileBaseBaseOutput {
  nickname: string
  name: string | null
  surname: string | null
  description: string | null
  avatarId: string | null
  reputationScore: number
  currentActivity: number
}

export interface ProfileAdvancedBaseOutput extends ProfileBaseBaseOutput {
  id: string
  userId: string
  birthDate: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface ProfileListBaseOutput {
  nickname: string
  avatarId: string | null
  currentActivity: number
}

export type ProfilePaginationBaseBaseOutput = PaginationBaseOutput
export interface ProfilePaginationAdvancedBaseOutput extends ProfilePaginationBaseBaseOutput {
  birthDateFrom?: Date
  birthDateTo?: Date
  reputationFrom?: number
  reputationTo?: number
  currentActivity?: number
}

export interface PaginatedProfilesBaseBaseOutput {
  pagination: ProfilePaginationBaseBaseOutput
  profiles: ProfileListBaseOutput[]
}

export interface PaginatedProfilesAdvancedBaseOutput {
  pagination: ProfilePaginationAdvancedBaseOutput
  profiles: ProfileListBaseOutput[]
}
