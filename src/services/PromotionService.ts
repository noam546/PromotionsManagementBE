import { IPromotion } from '../models/Promotion'
import promotionRepository, { 
  CreatePromotionData, 
  UpdatePromotionData, 
  PromotionFilters 
} from '../repositories/PromotionRepository'

export interface PromotionResponse {
  id: string
  name: string
  userGroupName: string
  type: string
  startDate: Date
  endDate: Date
  isActive: boolean
  isDeleted: boolean
  isValid: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    totalPages: number
    limit: number
  }
}

export class PromotionService {
  private transformPromotion(promotion: IPromotion): PromotionResponse {
    const now = new Date()
    const isValid = promotion.isActive && 
                   !promotion.isDeleted && 
                   promotion.startDate <= now && 
                   promotion.endDate >= now

    return {
      id: promotion._id.toString(),
      name: promotion.name,
      userGroupName: promotion.userGroupName,
      type: promotion.type,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      isActive: promotion.isActive,
      isDeleted: promotion.isDeleted,
      isValid,
      createdAt: promotion.createdAt,
      updatedAt: promotion.updatedAt
    }
  }

  async createPromotion(data: CreatePromotionData): Promise<PromotionResponse> {
    // Business logic validation
    if (data.startDate >= data.endDate) {
      throw new Error('End date must be after start date')
    }

    const promotion = await promotionRepository.create(data)
    return this.transformPromotion(promotion)
  }

  async getPromotionById(id: string, includeDeleted: boolean = false): Promise<PromotionResponse | null> {
    const promotion = await promotionRepository.findById(id, includeDeleted)
    if (!promotion) {
      return null
    }
    return this.transformPromotion(promotion)
  }

  async getAllPromotions(
    filters: PromotionFilters = {}, 
    page: number = 1, 
    limit: number = 10
  ): Promise<PaginatedResponse<PromotionResponse>> {
    const result = await promotionRepository.findAll(filters, page, limit)
    
    return {
      data: result.promotions.map(promotion => this.transformPromotion(promotion)),
      pagination: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        limit
      }
    }
  }

  async getActivePromotions(): Promise<PromotionResponse[]> {
    const promotions = await promotionRepository.findActivePromotions()
    return promotions.map(promotion => this.transformPromotion(promotion))
  }

  async updatePromotion(id: string, data: UpdatePromotionData): Promise<PromotionResponse | null> {
    // Business logic validation
    if (data.startDate && data.endDate && data.startDate >= data.endDate) {
      throw new Error('End date must be after start date')
    }

    const promotion = await promotionRepository.update(id, data)
    if (!promotion) {
      return null
    }
    return this.transformPromotion(promotion)
  }

  async deletePromotion(id: string): Promise<boolean> {
    return await promotionRepository.delete(id)
  }

  async hardDeletePromotion(id: string): Promise<boolean> {
    return await promotionRepository.hardDelete(id)
  }

  async deactivatePromotion(id: string): Promise<PromotionResponse | null> {
    const promotion = await promotionRepository.softDelete(id)
    if (!promotion) {
      return null
    }
    return this.transformPromotion(promotion)
  }

  async getPromotionsByUserGroup(userGroupName: string): Promise<PromotionResponse[]> {
    const promotions = await promotionRepository.findByUserGroup(userGroupName)
    return promotions.map(promotion => this.transformPromotion(promotion))
  }
}

export default new PromotionService() 