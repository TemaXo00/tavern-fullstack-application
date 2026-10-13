import { ResponseType } from '@org/response-types';

import { isFetchError } from './utils/is-fetch-error.js';
import { getMessageByStatus } from './utils/message-by-status.js';

export const extractApiError = (error: unknown): ResponseType<string> => {
  if (isFetchError(error)) {
    const statusCode = error.response?.status ?? 0;
    const body = error.response?._data as Partial<ResponseType<string>> & {
      message?: string;
      timestamp?: string;
    };

    return {
      status: 'error',
      date: body?.date ?? new Date().toLocaleDateString(),
      time: body?.time ?? new Date().toLocaleTimeString(),
      path: body?.path,
      data: body?.message ?? body?.data ?? getMessageByStatus(statusCode),
    };
  }

  if (error instanceof Error) {
    return {
      status: 'error',
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      data: error.message || getMessageByStatus(500),
    };
  }

  return {
    status: 'error',
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    data: getMessageByStatus(500),
  };
};
