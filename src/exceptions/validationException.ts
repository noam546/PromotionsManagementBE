import { BaseException } from './baseException'

export interface ValidationErrorDetails {
  resourceType?: string
  [key: string]: any
}

export class ValidationException extends BaseException {
  public readonly details: ValidationErrorDetails

  constructor(message: string, details: ValidationErrorDetails = {}) {
    super(message, 400)
    this.details = details
  }

  static invalidDateRange(details: { startDate: string; endDate: string; resourceType?: string }): ValidationException {
    return new ValidationException(
      'End date must be after start date',
      details
    )
  }

  static invalidSortOrder(details: { sortOrder: string; resourceType?: string }): ValidationException {
    return new ValidationException(
      'Sort order must be either "asc" or "desc"',
      details
    )
  }

  static invalidPagination(details: { page: number; limit: number; resourceType?: string }): ValidationException {
    return new ValidationException(
      'Invalid pagination parameters. Both page and limit must be positive numbers.',
      details
    )
  }

} 