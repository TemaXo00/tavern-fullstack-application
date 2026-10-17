import { Injectable } from '@nestjs/common'
import { GRPC_TO_ROLE, GRPC_TO_TOKEN_STATE, ROLE_TO_GRPC, TOKEN_STATE_TO_GRPC } from '@org/enums'
import {
  TokenOutput,
  TokenPaginationInput,
  TokenPaginationOutput,
  UserEntity,
  UserOutput,
  UserPaginationInput,
  UserPaginationOutput,
} from '@org/grpc-types'
import {
  TokenPaginationSharedInput,
  TokenPaginationSharedOutput,
  TokenSharedOutput,
  UserPaginationSharedInput,
  UserPaginationSharedOutput,
  UserSharedEntity,
  UserSharedOutput,
} from '@org/shared-types'

@Injectable()
export class AuthGatewayMapService {
  mapUserEntity(user: UserEntity): UserSharedEntity {
    return {
      ...user,
      role: GRPC_TO_ROLE[user.role],
    }
  }

  mapUserPaginationRequest(pagination: UserPaginationSharedInput): UserPaginationInput {
    return {
      ...pagination,
      role: pagination.role ? ROLE_TO_GRPC[pagination.role] : undefined,
    }
  }

  mapUserPaginationResponse(pagination: UserPaginationOutput): UserPaginationSharedOutput {
    return {
      ...pagination,
      role: pagination.role ? GRPC_TO_ROLE[pagination.role] : undefined,
    }
  }

  mapAllUsersResponse(users?: UserOutput[]): UserSharedOutput[] {
    if (!users || !Array.isArray(users)) {
      return []
    }
    return users.map((user) => ({
      ...user,
      role: GRPC_TO_ROLE[user.role],
    }))
  }

  mapUserResponse(user: UserOutput): UserSharedOutput {
    return {
      ...user,
      role: GRPC_TO_ROLE[user.role],
    }
  }

  mapTokenResponse(token: TokenOutput): TokenSharedOutput {
    return {
      ...token,
      state: GRPC_TO_TOKEN_STATE[token.state],
    }
  }

  mapAllTokensResponse(tokens?: TokenOutput[]): TokenSharedOutput[] {
    if (!tokens || !Array.isArray(tokens)) {
      return []
    }
    return tokens.map((token) => ({
      ...token,
      state: GRPC_TO_TOKEN_STATE[token.state],
    }))
  }

  mapTokenPaginationResponse(pagination: TokenPaginationOutput): TokenPaginationSharedOutput {
    return {
      ...pagination,
      state: pagination.state ? GRPC_TO_TOKEN_STATE[pagination.state] : undefined,
    }
  }

  mapTokenPaginationRequest(pagination: TokenPaginationSharedInput): TokenPaginationInput {
    return {
      ...pagination,
      state: pagination.state ? TOKEN_STATE_TO_GRPC[pagination.state] : undefined,
    }
  }
}
