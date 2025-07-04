import { Request, Response } from 'express'
import { emitPromotionEvent } from '../index'
import { PromotionService } from '../services'

export class PromotionController {

    // GET /api/promotions
    public static async getAllPromotions(req: Request, res: Response): Promise<void> {
        const { query : {page: pageStr, limit: limitStr, sortBy, sortOrder: sortOrderStr, type, userGroupName, search, startDate: startDateStr, endDate: endDateStr }} = req
        
        const page = parseInt(pageStr as string) || 1
        const limit = parseInt(limitStr as string) || 10
        
        const sortField = sortBy as string || 'createdAt'
        const sortOrder = (sortOrderStr as string || 'desc').toLowerCase() as 'asc' | 'desc'
        
        if (sortOrder !== 'asc' && sortOrder !== 'desc') {
            res.status(400).json({
                success: false,
                message: 'sortOrder must be either "asc" or "desc"'
            })
            return
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
        res.json({
            data: result.data,
            pagination: result.pagination,
        })   
    }

    // GET /api/promotions/:id
    public static async getPromotionById(req: Request, res: Response): Promise<void> {
        try {
            const { params } = req
            const { id } = params
            
            const promotion = await PromotionService.getPromotionById(id)
            
            if (!promotion) {
                res.status(404).json({
                    success: false,
                    message: 'Promotion not found'
                })
                return
            }
            
            res.json({
                data: promotion,
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving promotion',
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }
    // POST /api/promotions - Create new promotion
    static async createPromotion(req: Request, res: Response) {
        try {
            const { body } = req
            const newPromotion = await PromotionService.createPromotion(body)
            
            emitPromotionEvent('promotion_created', {
                promotion: newPromotion
            })
            
            res.status(201).json(newPromotion)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    // PUT /api/promotions/:id - Update promotion
    static async updatePromotion(req: Request, res: Response) {
        try {
            const { params, body } = req
            
            const updatedPromotion = await PromotionService.updatePromotion(params.id, body)

            emitPromotionEvent('promotion_updated', {
                promotion: updatedPromotion,
            })
            
            res.json(updatedPromotion)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    // DELETE /api/promotions/:id - Soft delete promotion
    static async deletePromotion(req: Request, res: Response) {
        try {
            const { params } = req
            await PromotionService.deletePromotion(params.id)
            
            emitPromotionEvent('promotion_deleted', {
                promotionId: params.id
            })
            
            res.status(204).send()
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}