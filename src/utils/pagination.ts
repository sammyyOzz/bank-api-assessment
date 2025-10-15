import {
  IPaginatedResponse,
  IPaginationParams,
  IPaginationResult,
} from '../types/pagination.types';

export class PaginationHelper {
  private static readonly DEFAULT_PAGE = 1;

  private static readonly DEFAULT_LIMIT = 10;

  private static readonly MAX_LIMIT = 100;

  static validateAndNormalize(params: IPaginationParams) {
    const page = Math.max(1, params.page || this.DEFAULT_PAGE);
    const limit = Math.min(Math.max(1, params.limit || this.DEFAULT_LIMIT), this.MAX_LIMIT);
    const skip = (page - 1) * limit;

    return { page, limit, skip };
  }

  static createIPaginationResult(page: number, limit: number, total: number): IPaginationResult {
    const pages = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1,
    };
  }

  static formatResponse<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
  ): IPaginatedResponse<T> {
    return {
      data,
      pagination: this.createIPaginationResult(page, limit, total),
    };
  }
}
