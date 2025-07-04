import { BaseException } from './baseException'

export interface NotFoundErrorDetails {
  resourceType?: string
  message?: string
  [key: string]: any 
}

export class NotFoundException extends BaseException {
  public readonly details: NotFoundErrorDetails

  constructor(message: string, details: NotFoundErrorDetails = {}) {
    super(message, 404)
    this.details = details
  }

  static promotionNotFound(details: { id: string }): NotFoundException {
    return new NotFoundException(
      'Promotion not found',
      { ...details, resourceType: 'promotion' }
    )
  }


} 