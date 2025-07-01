import { IPromotion } from '../models/Promotion'
import promotionRepository, { 
  CreatePromotionData, 
  UpdatePromotionData, 
  PromotionFilters 
} from '../repositories/PromotionRepository'

export interface PromotionResponse {
  id: string
  promotionName: string
  userGroupName: string
  type: string
  startDate: Date
  endDate: Date
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
    return {
      id: promotion._id.toString(),
      promotionName: promotion.promotionName,
      userGroupName: promotion.userGroupName,
      type: promotion.type,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
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

  async getPromotionById(id: string): Promise<PromotionResponse | null> {
    const promotion = await promotionRepository.findById(id)
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
}

export default new PromotionService() 