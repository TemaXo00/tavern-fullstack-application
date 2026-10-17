import { AuthBaseOutput } from '@org/base-types'

export type AuthSharedOutput = Omit<AuthBaseOutput, 'refreshToken'>
