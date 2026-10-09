interface PaginationInput {
  page: number;
  limit: number;
  search?: string;
}

export interface PaginationBaseOutput extends PaginationInput {
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export type PaginationBaseInput = Partial<PaginationInput>;
