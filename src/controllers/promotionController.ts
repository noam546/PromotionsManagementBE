import { Request, Response } from 'express'
import promotionService from '../services/PromotionService'

export class PromotionController {
    // GET /api/promotions
    public static async getAllPromotions(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10

            const filters = {
                type: req.query.type as string,
                userGroupName: req.query.userGroupName as string,
                search: req.query.search as string,
                startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
                endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
            }
            const result = await promotionService.getAllPromotions(filters, page, limit)
            res.json({
                success: true,
                data: result.data,
                pagination: result.pagination,
                message: 'Promotions retrieved successfully'
            })
        } catch (error) {
            console.log("errasdsdffdsddsor",error)
            res.status(500).json({
                success: false,
                message: 'Error retrieving promotions',
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }

    // GET /api/promotions/:id
    public static async getPromotionById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            
            const promotion = await promotionService.getPromotionById(id)
            
            if (!promotion) {
                res.status(404).json({
                    success: false,
                    message: 'Promotion not found'
                })
                return
            }
            
            res.json({
                success: true,
                data: promotion,
                message: 'Promotion retrieved successfully'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving promotion',
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }

    // POST /api/promotions
    public static async createPromotion(req: Request, res: Response): Promise<void> {
        try {
            const { promotionName, userGroupName, type, startDate, endDate } = req.body
            
            // Basic validation
            if (!promotionName || !userGroupName || !type || !startDate || !endDate) {
                res.status(400).json({
                    success: false,
                    message: 'Name, userGroupName, type, startDate, and endDate are required'
                })
                return
            }

            // Validate promotion type
            if (!['event', 'sale', 'bonus'].includes(type)) {
                res.status(400).json({
                    success: false,
                    message: 'Type must be event, sale, or bonus'
                })
                return
            }

            const promotionData = {
                promotionName,
                userGroupName,
                type,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            }

            const promotion = await promotionService.createPromotion(promotionData)
            
            res.status(201).json({
                success: true,
                data: promotion,
                message: 'Promotion created successfully'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating promotion',
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }

    // PUT /api/promotions/:id
    public static async updatePromotion(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            const updateData = req.body

            // Convert date strings to Date objects if provided
            if (updateData.startDate) {
                updateData.startDate = new Date(updateData.startDate)
            }
            if (updateData.endDate) {
                updateData.endDate = new Date(updateData.endDate)
            }

            // Validate promotion type if provided
            if (updateData.type && !['event', 'sale', 'bonus'].includes(updateData.type)) {
                res.status(400).json({
                    success: false,
                    message: 'Type must be event, sale, or bonus'
                })
                return
            }

            const promotion = await promotionService.updatePromotion(id, updateData)
            
            if (!promotion) {
                res.status(404).json({
                    success: false,
                    message: 'Promotion not found'
                })
                return
            }
            
            res.json({
                success: true,
                data: promotion,
                message: 'Promotion updated successfully'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating promotion',
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }

    // DELETE /api/promotions/:id (Soft Delete)
    public static async deletePromotion(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            
            const deleted = await promotionService.deletePromotion(id)
            
            if (!deleted) {
                res.status(404).json({
                    success: false,
                    message: 'Promotion not found'
                })
                return
            }
            
            res.json({
                success: true,
                message: 'Promotion deleted successfully'
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting promotion',
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        }
    }

} 