import {
  BaseUpdateProfileInput,
  ProfilePaginationAdvancedInput,
} from './profiles-input.data.js';

export interface AdminCheckPaginatedProfiles {
  adminId: string;
  query: ProfilePaginationAdvancedInput;
}

export interface AdminCheckProfile {
  adminId: string;
  userId: string;
}

export interface UpdateProfile {
  userId: string;
  data: BaseUpdateProfileInput;
}
