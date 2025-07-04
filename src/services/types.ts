import { PromotionType } from "../repositories"

export interface PromotionResponse {
    id: string
    promotionName: string
    userGroupName: string
    type: PromotionType
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