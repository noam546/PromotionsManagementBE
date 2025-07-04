import { BaseException } from './baseException'

export class ValidationException extends BaseException {
  constructor(message: string) {
    super(message, 400)
  }

  static invalidDateRange(startDate: string, endDate: string): ValidationException {
    return new ValidationException(`End date (${endDate}) must be after start date (${startDate})`)
  }

  static invalidSortOrder(sortOrder: string): ValidationException {
    return new ValidationException(`Sort order must be either "asc" or "desc", received: ${sortOrder}`)
  }

  static invalidPagination(page: number, limit: number): ValidationException {
    return new ValidationException(`Invalid pagination parameters: page=${page}, limit=${limit}. Both must be positive numbers.`)
  }

} 