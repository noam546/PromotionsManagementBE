import { BaseException } from './baseException'

export class NotFoundException extends BaseException {
  constructor(message: string) {
    super(message, 404)
  }

  static promotionNotFound(id: string): NotFoundException {
    return new NotFoundException(`Promotion with id "${id}" not found`)
  }

  static resourceNotFound(resourceType: string, identifier: string): NotFoundException {
    return new NotFoundException(`${resourceType} with identifier "${identifier}" not found`)
  }
} 