export interface ApiHooks {
  getAccessToken?: () => string | null | undefined;
  onUnauthorized?: (error: unknown) => boolean | Promise<boolean>;
}

let apiHooks: ApiHooks = {};

export function configureApiHooks(hooks: ApiHooks): void {
  apiHooks = { ...apiHooks, ...hooks };
}

export function getApiHooks(): ApiHooks {
  return apiHooks;
}
