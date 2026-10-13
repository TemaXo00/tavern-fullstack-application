import { Ref } from 'vue';

export interface UseAT {
  accessToken: Ref<string | null>;
  setInLocal: (token: string) => void;
  loadFromLocal: () => void;
  delFromLocal: () => void;
}
