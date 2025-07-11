export type PromotionType = 'basic' | 'epic' | 'common'

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
  order: SortOrder
}    

export type SortOrder = 'asc' | 'desc'