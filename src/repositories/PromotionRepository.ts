import { IPromotion } from '../models/Promotion'
import Promotion from '../models/Promotion'

export interface CreatePromotionData {
  promotionName: string
  userGroupName: string
  type: 'event' | 'sale' | 'bonus'
  startDate: Date
  endDate: Date
}

export interface UpdatePromotionData {
  promotionName?: string
  userGroupName?: string
  type?: 'event' | 'sale' | 'bonus'
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

export class PromotionRepository {
  async create(data: CreatePromotionData): Promise<IPromotion> {
    try {
      const promotion = new Promotion(data)
      return await promotion.save()
    } catch (error) {
      throw new Error(`Failed to create promotion: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async findById(id: string): Promise<IPromotion | null> {
    try {
      const query: any = { _id: id }

      return await Promotion.findOne(query)
    } catch (error) {
      throw new Error(`Failed to find promotion by ID: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async findAll(filters: PromotionFilters = {}, page: number = 1, limit: number = 10): Promise<{ promotions: IPromotion[], total: number, page: number, totalPages: number }> {
    const query: any = {}

    if (filters.type) {
      query.type = filters.type
    }

    if (filters.userGroupName) {
      query.userGroupName = filters.userGroupName
    }

    if (filters.startDate || filters.endDate) {
      query.startDate = {}
      if (filters.startDate) query.startDate.$gte = filters.startDate
      if (filters.endDate) query.startDate.$lte = filters.endDate
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { userGroupName: { $regex: filters.search, $options: 'i' } }
      ]
    }

    const skip = (page - 1) * limit
    const [promotions, total] = await Promise.all([
      Promotion.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Promotion.countDocuments(query)
    ])

    return {
      promotions,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    }
  }

  async update(id: string, data: UpdatePromotionData): Promise<IPromotion | null> {
    try {

      return await Promotion.findOneAndUpdate(
        { _id: id },
        { ...data },
        { new: true, runValidators: true }
      )
    } catch (error) {
      throw new Error(`Failed to update promotion: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await Promotion.findByIdAndDelete(id)
      return !!result
    } catch (error) {
      throw new Error(`Failed to hard delete promotion: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

}

export default new PromotionRepository() 