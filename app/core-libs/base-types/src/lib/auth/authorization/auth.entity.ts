export interface UserBasePayload {
  id: string
  sessionId: string
  role: number
}

export interface UserBaseEntity {
  id: string
  email: string
  role: number
  isActive: boolean
  sessionId: string
  sessionName: string
}
