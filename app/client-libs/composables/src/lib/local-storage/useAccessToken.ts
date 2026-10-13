import { Ref, ref } from 'vue';

import { UseAT } from '../types/local-storage/access-token.type.js';

export function useAccessToken(): UseAT {
  const accessToken: Ref<string | null> = ref<string | null>(null);

  const loadFromLocal = (): void => {
    accessToken.value = localStorage.getItem('accessToken');
  };

  const setInLocal = (token: string): void => {
    accessToken.value = token;
    localStorage.setItem('accessToken', token);
  };

  const delFromLocal = (): void => {
    accessToken.value = null;
    localStorage.removeItem('accessToken');
  };

  return {
    accessToken,
    loadFromLocal,
    setInLocal,
    delFromLocal,
  };
}
