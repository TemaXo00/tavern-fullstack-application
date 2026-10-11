export const SHARED_MESSAGES = {
  INVALID_DATE: 'Invalid date',
  INVALID_EMAIL: 'Email',
  INVALID_ID: 'ID',
  INVALID_DATA: 'Data',
  RPC_ERROR: (arg: string): string => {
    return `Invalid ${arg}`;
  },
} as const;
