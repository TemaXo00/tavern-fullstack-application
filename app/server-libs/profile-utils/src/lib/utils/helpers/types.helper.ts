import { Actions, ActivityType } from '@org/profile-database'

export type SearchUserHelperType = 'by-id' | 'by-nickname'

export interface BaseManipulationOptions {
  userId: string
  updatingActivity: ActivityType
  logMethod: string
}

export interface BlockManipulateOptions extends BaseManipulationOptions {
  reputationScore: number
  action: Actions
  message: string
}

export type ActivityManipulateOptions = BaseManipulationOptions
