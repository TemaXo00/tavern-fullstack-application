import { useApi } from './useApi.js';
import { request } from '../../api.client.js';
import { UseAPIRequest } from '../types/api/request.type.js';
import { UseWithoutBODYResponse } from '../types/api/response.type.js';

export function useGET<T>(options: UseAPIRequest): UseWithoutBODYResponse<T> {
  const api = useApi<T>(options);

  const get = (): Promise<T | null> =>
    api.execute(() =>
      request<T>(api.apiPath, {
        method: 'GET',
        skipAuthRefresh: options.skipAuthRefresh,
      }),
    );

  return {
    data: api.data,
    loading: api.loading,
    error: api.error,
    method: get,
  };
}
