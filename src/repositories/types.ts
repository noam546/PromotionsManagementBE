export type PromotionType = 'event' | 'sale' | 'bonus'

export interface CreatePromotionData {
  promotionName: string
  userGroupName: string
  type: PromotionType
  startDate: Date
  endDate: Date
}


export interface UpdatePromotionData {
  promotionName?: string
  userGroupName?: string
  type?: PromotionType
  startDate?: Date
  endDate?: Date
}

export interface PromotionFilters {
  type?: string
  userGroupName?: string
  startDate?: Date
  endDate?: Date
  search?: string
}

export interface SortOptions {
  field: string
  order: 'asc' | 'desc'
} 