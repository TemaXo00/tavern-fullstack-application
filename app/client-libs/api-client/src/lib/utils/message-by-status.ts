import { API_MESSAGES } from '@org/client-messages';

export const getMessageByStatus = (statusCode: number): string => {
  return (
    API_MESSAGES.ERRORS[statusCode as keyof typeof API_MESSAGES.ERRORS] ??
    API_MESSAGES.ERRORS.DEFAULT
  );
};
