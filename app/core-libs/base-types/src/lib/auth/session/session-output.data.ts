export interface SessionBaseOutput {
  id: string
  userId: string
  localName: string | null
  device: string
  browser: string
  os: string
  ip: string
  createdAt: Date
  updatedAt: Date
}

export interface AllSessionsBaseOutput {
  sessions: SessionBaseOutput[]
}
