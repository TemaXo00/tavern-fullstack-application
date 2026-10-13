import { API_MESSAGES } from '@org/client-messages';
import { type FetchError, ofetch } from 'ofetch';

import type { ResponseType } from '@org/response-types';

export const API_URL = '/api';

export const apiConfig = ofetch.create({
  baseURL: API_URL,
  timeout: 10000,
  responseType: 'json',
  retry: 3,
  retryStatusCodes: [500, 502, 503, 504],
  retryDelay: 2000,
  onResponse({ response }) {
    if (response.status >= 200 && response.status < 300) {
      const body = response._data as ResponseType<unknown>;
      response._data = body.data;
    }
  },
});

const isFetchError = (error: unknown): error is FetchError => {
  return (
    error !== null &&
    typeof error === 'object' &&
    'response' in error &&
    'message' in error
  );
};

const getMessageByStatus = (statusCode: number): string => {
  return (
    API_MESSAGES.ERRORS[statusCode as keyof typeof API_MESSAGES.ERRORS] ??
    API_MESSAGES.ERRORS.DEFAULT
  );
};

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
