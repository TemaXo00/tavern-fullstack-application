import { apiConfig } from '@org/api-client';

import { useApi } from './useApi.js';
import { UseAPIRequest } from '../types/api/request.type.js';
import { UseBODYMethodsResponse } from '../types/api/response.type.js';

export function usePUT<T, B extends object>(
  options: UseAPIRequest,
): UseBODYMethodsResponse<T, B> {
  const api = useApi<T>(options);

  const put = (data?: B): Promise<T | null> =>
    api.execute(() =>
      apiConfig<T>(api.apiPath, {
        method: 'PUT',
        body: data,
      }),
    );

  return {
    data: api.data,
    loading: api.loading,
    error: api.error,
    method: put,
  };
}
