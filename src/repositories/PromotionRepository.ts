import { IPromotion } from '../models/Promotion'
import Promotion from '../models/Promotion'

export interface CreatePromotionData {
  name: string
  userGroupName: string
  type: 'event' | 'sale' | 'bonus'
  startDate: Date
  endDate: Date
  isActive?: boolean
}

export interface UpdatePromotionData {
  name?: string
  userGroupName?: string
  type?: 'event' | 'sale' | 'bonus'
  startDate?: Date
  endDate?: Date
  isActive?: boolean
}

export interface PromotionFilters {
  isActive?: boolean
  type?: string
  userGroupName?: string
  startDate?: Date
  endDate?: Date
  search?: string
  includeDeleted?: boolean
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

  async findById(id: string, includeDeleted: boolean = false): Promise<IPromotion | null> {
    try {
      const query: any = { _id: id }
      if (!includeDeleted) {
        query.isDeleted = false
      }
      return await Promotion.findOne(query)
    } catch (error) {
      throw new Error(`Failed to find promotion by ID: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async findAll(filters: PromotionFilters = {}, page: number = 1, limit: number = 10): Promise<{ promotions: IPromotion[], total: number, page: number, totalPages: number }> {
    try {
      const query: any = {}

      // Apply filters
      if (filters.isActive !== undefined) {
        query.isActive = filters.isActive
      }

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

      // Handle soft delete filter
      if (!filters.includeDeleted) {
        query.isDeleted = false
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
    } catch (error) {
      throw new Error(`Failed to find promotions: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async findActivePromotions(): Promise<IPromotion[]> {
    try {
      const now = new Date()
      return await Promotion.find({
        isActive: true,
        isDeleted: false,
        startDate: { $lte: now },
        endDate: { $gte: now }
      }).sort({ createdAt: -1 }).lean()
    } catch (error) {
      throw new Error(`Failed to find active promotions: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async update(id: string, data: UpdatePromotionData): Promise<IPromotion | null> {
    try {
      return await Promotion.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { ...data, updatedAt: new Date() },
        { new: true, runValidators: true }
      )
    } catch (error) {
      throw new Error(`Failed to update promotion: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await Promotion.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isDeleted: true, updatedAt: new Date() },
        { new: true }
      )
      return !!result
    } catch (error) {
      throw new Error(`Failed to delete promotion: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async hardDelete(id: string): Promise<boolean> {
    try {
      const result = await Promotion.findByIdAndDelete(id)
      return !!result
    } catch (error) {
      throw new Error(`Failed to hard delete promotion: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async restore(id: string): Promise<IPromotion | null> {
    try {
      return await Promotion.findOneAndUpdate(
        { _id: id, isDeleted: true },
        { isDeleted: false, updatedAt: new Date() },
        { new: true }
      )
    } catch (error) {
      throw new Error(`Failed to restore promotion: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async softDelete(id: string): Promise<IPromotion | null> {
    try {
      return await Promotion.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isActive: false, isDeleted: true, updatedAt: new Date() },
        { new: true }
      )
    } catch (error) {
      throw new Error(`Failed to soft delete promotion: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async count(includeDeleted: boolean = false): Promise<number> {
    try {
      const query: any = {}
      if (!includeDeleted) {
        query.isDeleted = false
      }
      return await Promotion.countDocuments(query)
    } catch (error) {
      throw new Error(`Failed to count promotions: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async findByUserGroup(userGroupName: string): Promise<IPromotion[]> {
    try {
      const now = new Date()
      return await Promotion.find({
        userGroupName,
        isActive: true,
        isDeleted: false,
        startDate: { $lte: now },
        endDate: { $gte: now }
      }).sort({ createdAt: -1 }).lean()
    } catch (error) {
      throw new Error(`Failed to find promotions by user group: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async findDeletedPromotions(): Promise<IPromotion[]> {
    try {
      return await Promotion.find({ isDeleted: true })
        .sort({ updatedAt: -1 })
        .lean()
    } catch (error) {
      throw new Error(`Failed to find deleted promotions: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

export default new PromotionRepository() 