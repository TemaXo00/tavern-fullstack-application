import { PaginationBaseOutput } from '../../shared/pagination.type.js';

export interface TokenPaginationBaseOutput extends PaginationBaseOutput {
  state?: number;
}

export interface TokenBaseOutput {
  id: string;
  email: string;
  state: number;
  createdAt: Date;
  expiresAt: Date;
}

export interface AllTokensBaseOutput {
  pagination: TokenPaginationBaseOutput;
  tokens: TokenBaseOutput[];
}
