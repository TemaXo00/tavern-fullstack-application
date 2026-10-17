import { PaginationBaseOutput } from '../../shared/pagination.type.js'

export interface UserPaginationBaseOutput extends PaginationBaseOutput {
  isBlocked?: boolean
  isActive?: boolean
  role?: number
}

export interface UserBaseOutput {
  id: string
  email: string
  role: number
  isActive: boolean
  isBlocked: boolean
  blockedUntil: Date | null
  blockReason: string | null
  createdAt: Date
}

export interface PaginatedUserBaseOutput {
  pagination: UserPaginationBaseOutput
  users: UserBaseOutput[]
}
