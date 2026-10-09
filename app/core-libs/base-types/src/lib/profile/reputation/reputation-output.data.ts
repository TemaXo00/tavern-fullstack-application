import { PaginationBaseOutput } from '../../shared/pagination.type.js';

export interface ReputationPaginationBaseOutput extends PaginationBaseOutput {
  action?: number;
}

export interface ReputationBaseOutput {
  action: number;
  message: string;
  score: number;
  createdAt: Date;
}

export interface PaginatedReputationBaseOutput {
  pagination: ReputationPaginationBaseOutput;
  reputationLogs: ReputationBaseOutput[];
}
