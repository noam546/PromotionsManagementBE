import { Request, Response } from 'express'
import { emitPromotionEvent } from '../index' // Import the helper function
import PromotionService from '../services/PromotionService'

export class PromotionController {

    // GET /api/promotions
    public static async getAllPromotions(req: Request, res: Response): Promise<void> {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const filters = {
            type: req.query.type as string,
            userGroupName: req.query.userGroupName as string,
            search: req.query.search as string,
            startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
            endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
        }
        const result = await PromotionService.getAllPromotions(filters, page, limit)
        res.json({
            data: result.data,
            pagination: result.pagination,
        })   
    }

    // GET /api/promotions/:id
    public static async getPromotionById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            
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
            // Your existing logic to create promotion
            const newPromotion = await PromotionService.createPromotion(req.body)
            
            // Emit WebSocket event after successful creation
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
            
            // Your existing logic to update promotion
            const updatedPromotion = await PromotionService.updatePromotion(req.params.id, req.body)
            
            // Emit WebSocket event after successful update
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
            // Your existing logic to soft delete promotion
            await PromotionService.deletePromotion(req.params.id)
            
            // Emit WebSocket event after successful deletion
            emitPromotionEvent('promotion_deleted', {
                promotionId: req.params.id
            })
            
            res.status(204).send()
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}