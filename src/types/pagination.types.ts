export interface IPaginationParams {
  page?: number;
  limit?: number;
}

export interface IPaginationResult {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: IPaginationResult;
}

export interface IFindOptions {
  skip?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}
