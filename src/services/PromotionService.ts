import { IPromotion } from "../models"
import { CreatePromotionData, PromotionFilters, SortOptions, UpdatePromotionData, PromotionRepository } from "../repositories"
import { PaginatedResponse, PromotionResponse } from "./types"

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
    if (data.startDate >= data.endDate) {
      throw new Error('End date must be after start date')
    }

    const promotion = await PromotionRepository.create(data)
    return this.transformPromotion(promotion)
  }

  async getPromotionById(id: string): Promise<PromotionResponse | null> {
    const promotion = await PromotionRepository.findById(id)
    if (!promotion) {
      return null
    }
    return this.transformPromotion(promotion)
  }

  async getAllPromotions(
    filters: PromotionFilters = {}, 
    page: number = 1, 
    limit: number = 10,
    sort: SortOptions = { field: 'createdAt', order: 'desc' }
  ): Promise<PaginatedResponse<PromotionResponse>> {
    const result = await PromotionRepository.findAll(filters, page, limit, sort)
    
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

    const promotion = await PromotionRepository.update(id, data)
    if (!promotion) {
      return null
    }
    return this.transformPromotion(promotion)
  }

  async deletePromotion(id: string): Promise<boolean> {
    return await PromotionRepository.delete(id)
  }
}

export default new PromotionService() 