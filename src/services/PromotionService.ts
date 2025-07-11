import { IPromotion } from "../models"
import { CreatePromotionData, PromotionFilters, SortOptions, UpdatePromotionData, PromotionRepository } from "../repositories"
import { DEFAULT_SORT_FIELD, DESC } from "../utils"
import { PaginatedResponse, PromotionResponse } from "./types"
import { ValidationException, NotFoundException } from "../exceptions"

export class PromotionService {
  private mapPromotion(promotion: IPromotion): PromotionResponse {
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
      throw ValidationException.invalidDateRange({
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString()
      })
    }

    const promotion = await PromotionRepository.create(data)
    return this.mapPromotion(promotion)
  }

  async getPromotionById(id: string): Promise<PromotionResponse> {
    const promotion = await PromotionRepository.findById(id)
    return this.mapPromotion(promotion)
  }

  async getAllPromotions(
    filters: PromotionFilters = {}, 
    page: number = 1, 
    limit: number = 10,
    sort: SortOptions = { field: DEFAULT_SORT_FIELD, order: DESC }
  ): Promise<PaginatedResponse<PromotionResponse>> {
    const result = await PromotionRepository.findAll(filters, page, limit, sort)
    
    return {
      data: result.promotions.map(promotion => this.mapPromotion(promotion)),
      pagination: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        limit
      }
    }
  }

  async updatePromotion(id: string, data: UpdatePromotionData): Promise<PromotionResponse> {

    if (data.startDate && data.endDate && data.startDate >= data.endDate) {
      throw ValidationException.invalidDateRange({
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString()
      })
    }

    const promotion = await PromotionRepository.update(id, data)
    return this.mapPromotion(promotion)
  }

  async deletePromotion(id: string): Promise<boolean> {
    const deleted = await PromotionRepository.delete(id)
    return deleted
  }
}

export default new PromotionService() 