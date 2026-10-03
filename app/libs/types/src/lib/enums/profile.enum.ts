export enum ActivityType {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
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
