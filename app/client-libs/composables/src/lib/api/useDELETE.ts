import { apiConfig } from '@org/api-client';

import { useApi } from './useApi.js';
import { UseAPIRequest } from '../types/api/request.type.js';
import { UseWithoutBODYResponse } from '../types/api/response.type.js';

export function useDELETE<T>(
  options: UseAPIRequest,
): UseWithoutBODYResponse<T> {
  const api = useApi<T>(options);

  const remove = (): Promise<T | null> =>
    api.execute(() =>
      apiConfig<T>(api.apiPath, {
        method: 'DELETE',
      }),
    );

  return {
    data: api.data,
    loading: api.loading,
    error: api.error,
    method: remove,
  };
}
