import { SessionInput, UserPaginationInput } from '@org/grpc-types'

interface BaseAdminUserMessage {
  adminId: string
  userId: string
}

interface BaseUserMessage {
  userId: string
}

export interface UsersCheckByAdminMessage {
  adminId: string
  query: UserPaginationInput
}

export type UserByIdAdminCheckMessage = BaseAdminUserMessage

export interface AdminBlockUserMessage extends BaseAdminUserMessage {
  email: string
  blockReason: string
  blockedFrom: Date
  blockedUntil: Date
}

export type AdminBlockUserLog = AdminBlockUserMessage
export type AdminBlockUserProfile = Omit<AdminBlockUserMessage, 'adminId' | 'email'>
export type AdminBlockUserMail = Omit<AdminBlockUserMessage, 'adminId'>
export type AdminBlockUserEvent = BaseAdminUserMessage

export interface AdminUnblockUserMessage extends BaseAdminUserMessage {
  email: string
}

export type AdminPromoteUserMessage = BaseAdminUserMessage
export type AdminDemoteUserMessage = BaseAdminUserMessage

export interface UserChangeEmailMessage extends BaseUserMessage {
  oldEmail: string
  newEmail: string
  session: SessionInput
}

export interface UserChangePasswordMessage extends BaseUserMessage {
  session: SessionInput
  email: string
}

export type UserSetInactiveMessage = BaseUserMessage

export interface AdminSetUserActiveMessage extends BaseAdminUserMessage {
  email: string
}

export interface DeleteUserMessage extends BaseUserMessage {
  email: string
}
