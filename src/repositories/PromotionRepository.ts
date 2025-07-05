import { IPromotion, Promotion } from "../models"
import { DEFAULT_LIMIT, DEFAULT_PAGE, DEFAULT_SORT_FIELD, DEFAULT_SORT_ORDER } from "../utils"
import { CreatePromotionData, UpdatePromotionData, PromotionFilters, SortOptions } from "./types"
import { NotFoundException } from "../exceptions"

export class PromotionRepository {
  async create(data: CreatePromotionData): Promise<IPromotion> {
    const promotion = new Promotion(data)
    return await promotion.save()
  }

  async findById(id: string): Promise<IPromotion> {
    const query: any = { _id: id }

    const promotion = await Promotion.findOne(query)
    if (!promotion) {
      throw NotFoundException.promotionNotFound({ id })
    }

    return promotion
  }

  async findAll(
    filters: PromotionFilters = {}, 
    page: number = DEFAULT_PAGE, 
    limit: number = DEFAULT_LIMIT,
    sort: SortOptions = { field: DEFAULT_SORT_FIELD, order: DEFAULT_SORT_ORDER }
  ): Promise<{ promotions: IPromotion[], total: number, page: number, totalPages: number }> {
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
        { promotionName: { $regex: filters.search, $options: 'i' } },
        { userGroupName: { $regex: filters.search, $options: 'i' } }
      ]
    }
    
    const skip = (page - 1) * limit
    const sortOrder = sort.order === 'asc' ? 1 : -1
    
    const [promotions, total] = await Promise.all([
      Promotion.find(query)
        .sort({ [sort.field]: sortOrder })
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
    const existingPromotion = await Promotion.findById(id)
    if (!existingPromotion) {
      throw NotFoundException.promotionNotFound({ id })
    }

    return await Promotion.findOneAndUpdate(
      { _id: id },
      { ...data },
      { new: true, runValidators: true }
    )
  }

  async delete(id: string): Promise<boolean> {
    const existingPromotion = await Promotion.findById(id)
    if (!existingPromotion) {
      throw NotFoundException.promotionNotFound({ id })
    }

    const result = await Promotion.findByIdAndDelete(id)
    return !!result
  }

}

export default new PromotionRepository() 