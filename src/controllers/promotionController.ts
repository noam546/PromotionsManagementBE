import { Request, Response } from 'express'
import { emitPromotionEvent } from '../index'
import { PromotionService } from '../services'
import { ControllerResponse } from './types'
import { PromotionResponse } from '../services/types'
import { DEFAULT_SORT_FIELD, DESC } from '../utils'

export class PromotionController {

    // GET /api/promotions
    public static async getAllPromotions(req: Request, res: Response): Promise<ControllerResponse<PromotionResponse[]>> {
        const { query : {page: pageStr, limit: limitStr, sortBy, sortOrder: sortOrderStr, type, userGroupName, search, startDate: startDateStr, endDate: endDateStr }} = req
        
        const page = parseInt(pageStr as string) || 1
        const limit = parseInt(limitStr as string) || 10
        
        const sortField = sortBy as string || DEFAULT_SORT_FIELD
        const sortOrder = (sortOrderStr as string || DESC).toLowerCase() as 'asc' | 'desc'
        
        if (sortOrder !== 'asc' && sortOrder !== 'desc') {
            return {
                statusCode: 400,
                body: {
                    message: 'sortOrder must be either "asc" or "desc"'
                }
            }
        }
        
        const filters = {
            type: type as string,
            userGroupName: userGroupName as string,
            search: search as string,
            startDate: startDateStr ? new Date(startDateStr as string) : undefined,
            endDate: endDateStr ? new Date(endDateStr as string) : undefined,
        }
        
        const sort = {
            field: sortField,
            order: sortOrder
        }
        
        const result = await PromotionService.getAllPromotions(filters, page, limit, sort)
        return {
            statusCode: 200,
            body: {
                data: result.data,
                pagination: result.pagination,
            }
        }
    }

    // GET /api/promotions/:id
    public static async getPromotionById(req: Request, res: Response): Promise<ControllerResponse<PromotionResponse>> {
            const { params } = req
            const { id } = params
            
            const promotion = await PromotionService.getPromotionById(id)
            
            return {
                statusCode: 200,
                body: {
                    data: promotion,
                }
            }

    }

    // POST /api/promotions - Create new promotion
    static async createPromotion(req: Request, res: Response): Promise<ControllerResponse<PromotionResponse>> {
            const { body } = req
            const newPromotion = await PromotionService.createPromotion(body)
            
            emitPromotionEvent('promotion_created', {
                promotion: newPromotion
            })
            
            return {
                statusCode: 201,
                body: {
                    data: newPromotion
                }
            }

    }

    // PUT /api/promotions/:id - Update promotion
    static async updatePromotion(req: Request, res: Response): Promise<ControllerResponse<PromotionResponse>> {
            const { params, body } = req
            
            const updatedPromotion = await PromotionService.updatePromotion(params.id, body)

            emitPromotionEvent('promotion_updated', {
                promotion: updatedPromotion,
            })
            
            return {
                statusCode: 200,
                body: {
                    data: updatedPromotion
                }
            }
        
    }

    // DELETE /api/promotions/:id - Soft delete promotion
    static async deletePromotion(req: Request, res: Response): Promise<ControllerResponse<void>> {
            const { params } = req
            await PromotionService.deletePromotion(params.id)
            
            emitPromotionEvent('promotion_deleted', {
                promotionId: params.id
            })
            
            return {
                statusCode: 204,
                body: {}
            }
        
    }
}