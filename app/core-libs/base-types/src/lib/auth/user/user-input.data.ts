import { PaginationBaseInput } from '../../shared/pagination.type.js'

export interface UserPaginationBaseInput extends PaginationBaseInput {
  isBlocked?: boolean
  isActive?: boolean
  role?: number
}

export interface GetAllUsersBaseInput {
  pagination: UserPaginationBaseInput
}

export interface BlockUserBaseInput {
  blockedUntil: Date
  blockReason: string
}

export interface ChangeEmailBaseInput {
  newEmail: string
}

export interface ChangePasswordBaseInput {
  oldPassword: string
  newPassword: string
  newPasswordConfirmation: string
}

export interface UserDeleteBaseInput {
  password: string
}

export interface UserByIdBaseInput {
  id: string
}
