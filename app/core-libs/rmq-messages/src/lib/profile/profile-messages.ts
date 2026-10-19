import { ProfilePaginationAdvancedInput, UpdateProfileRequestInput } from '@org/grpc-types'

export interface AdminCheckPaginatedProfiles {
  adminId: string
  query: ProfilePaginationAdvancedInput
}

export interface AdminCheckProfile {
  adminId: string
  userId: string
}

export interface UpdateProfile {
  userId: string
  data: UpdateProfileRequestInput
}

export interface ChangeReputation {
  adminId: string
  userId: string
  message: string
  score: number
}
