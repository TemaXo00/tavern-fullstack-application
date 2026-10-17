import { AllSessionByUserBaseInput, DeleteSessionByIdBaseInput, SessionLocalNameBaseInput } from '@org/base-types'

import { Protected } from '../../utils/protected.js'

export type AllSessionsByUserInput = Protected<AllSessionByUserBaseInput>
export type AllMySessionsInput = Protected<null>
export type SessionLocalNameInput = Protected<SessionLocalNameBaseInput>
export type DeleteSessionByIdInput = Protected<DeleteSessionByIdBaseInput>
export type DeleteAllSessionsInput = Protected<null>
