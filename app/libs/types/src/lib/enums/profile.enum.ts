export enum ActivityType {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
}

export enum Actions {
  EVENT = 'EVENT',
  FRIENDSHIP = 'FRIENDSHIP',
  REPORT = 'REPORT',
  BLOCK = 'BLOCK',
  EARLY_UNBLOCK = 'EARLY_UNBLOCK',
}

export const ACTIVITY_TO_GRPC: Record<ActivityType, number> = {
  [ActivityType.ACTIVE]: 0,
  [ActivityType.INACTIVE]: 1,
  [ActivityType.BLOCKED]: 2,
};

export const GRPC_TO_ACTIVITY: Record<number, ActivityType> = {
  0: ActivityType.ACTIVE,
  1: ActivityType.INACTIVE,
  2: ActivityType.BLOCKED,
};

export const ACTIONS_TO_GRPC: Record<Actions, number> = {
  [Actions.EVENT]: 0,
  [Actions.FRIENDSHIP]: 1,
  [Actions.REPORT]: 2,
  [Actions.BLOCK]: 3,
  [Actions.EARLY_UNBLOCK]: 4,
};

export const GRPC_TO_ACTIONS: Record<number, Actions> = {
  0: Actions.EVENT,
  1: Actions.FRIENDSHIP,
  2: Actions.REPORT,
  3: Actions.BLOCK,
  4: Actions.EARLY_UNBLOCK,
};
