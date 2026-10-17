// ACTIVITY TYPE ENUM

export enum ActivityType {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
}

export const ACTIVITY_TO_GRPC: Record<ActivityType, number> = {
  [ActivityType.ACTIVE]: 0,
  [ActivityType.INACTIVE]: 1,
  [ActivityType.BLOCKED]: 2,
}

export const GRPC_TO_ACTIVITY: Record<number, ActivityType> = {
  0: ActivityType.ACTIVE,
  1: ActivityType.INACTIVE,
  2: ActivityType.BLOCKED,
}

// ACTIONS ENUM

export enum Actions {
  EVENT = 'EVENT',
  REPORT = 'REPORT',
  BLOCK = 'BLOCK',
  EARLY_UNBLOCK = 'EARLY_UNBLOCK',
}

export const ACTIONS_TO_GRPC: Record<Actions, number> = {
  [Actions.EVENT]: 0,
  [Actions.REPORT]: 1,
  [Actions.BLOCK]: 2,
  [Actions.EARLY_UNBLOCK]: 3,
}

export const GRPC_TO_ACTIONS: Record<number, Actions> = {
  0: Actions.EVENT,
  1: Actions.REPORT,
  2: Actions.BLOCK,
  3: Actions.EARLY_UNBLOCK,
}
