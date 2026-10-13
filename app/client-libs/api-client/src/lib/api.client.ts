import { ofetch } from 'ofetch';

import type { ResponseType } from '@org/response-types';

export const API_URL = '/api';

export const apiConfig = ofetch.create({
  baseURL: API_URL,
  timeout: 10000,
  responseType: 'json',
  retry: 3,
  retryStatusCodes: [500, 502, 503, 504],
  retryDelay: 2000,
  onRequest({ options }) {
    options.headers.set('Authorization', 'Bearer hardcoded access');
  },
  onResponse({ response }) {
    if (response.status >= 200 && response.status < 300) {
      const body = response._data as ResponseType<unknown>;
      response._data = body.data;
    }
  },
});
