import { Actions } from '../../enums/profile.enum.js';
import { PaginationBaseOutput } from '../../shared/pagination.type.js';
import { Replace } from '../../utils/replace.js';

export interface ReputationPaginationOutput extends PaginationBaseOutput {
  action?: number;
}

export interface ReputationOutput {
  action: number;
  message: string;
  score: number;
  createdAt: Date;
}

export interface PaginatedReputationOutput {
  pagination: ReputationPaginationOutput;
  reputationLogs: ReputationOutput[];
}

export type ReputationPaginationGatewayOutput = Replace<
  ReputationPaginationOutput,
  {
    action?: Actions;
  }
>;

export type ReputationGatewayOutput = Replace<
  ReputationOutput,
  {
    action: Actions;
  }
>;

export interface PaginatedReputationGatewayOutput {
  pagination: ReputationPaginationGatewayOutput;
  reputationLogs: ReputationGatewayOutput[];
}
