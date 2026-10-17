import { PaginationBaseInput } from '../../shared/pagination.type.js'

export interface TokenPaginationBaseInput extends PaginationBaseInput {
  state?: number
}

export interface GetTokensBaseInput {
  pagination: TokenPaginationBaseInput
}

export interface TokenByIdBaseInput {
  id: string
}
