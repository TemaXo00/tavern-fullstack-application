export interface JoinEventMessage {
  userId: string
  status: number
}

export interface LeaveEventMessage {
  userId: string
}

export interface AddParticipantMessage {
  organizerId: string
  userId: string
  status: number
}

export interface DeleteParticipantMessage {
  organizerId: string
  userId: string
}

export interface ChangeParticipantStatusMessage {
  organizerId: string
  userId: string
  status: number
}
