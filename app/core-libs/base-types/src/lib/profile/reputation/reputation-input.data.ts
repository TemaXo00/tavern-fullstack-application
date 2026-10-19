import { PaginationBaseInput } from '../../shared/pagination.type.js'

export interface ReputationPaginationBaseInput extends PaginationBaseInput {
  action?: number
}

export interface GetMyReputationBaseInput {
  pagination: ReputationPaginationBaseInput
}

export interface GetReputationByNicknameBaseInput {
  nickname: string
  pagination: ReputationPaginationBaseInput
}

export interface AddReputationBaseInput {
  nickname: string
  score: number
  message: string
}
