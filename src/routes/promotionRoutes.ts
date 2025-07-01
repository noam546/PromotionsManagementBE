import { Router } from 'express'
import { PromotionController } from '../controllers/promotionController'

const router = Router()

// GET /api/promotions - Get all promotions with pagination and filters
router.get('/', PromotionController.getAllPromotions)

// GET /api/promotions/:id - Get promotion by ID
router.get('/:id', PromotionController.getPromotionById)

// POST /api/promotions - Create new promotion
router.post('/', PromotionController.createPromotion)

// PUT /api/promotions/:id - Update promotion
router.put('/:id', PromotionController.updatePromotion)

// DELETE /api/promotions/:id - Soft delete promotion
router.delete('/:id', PromotionController.deletePromotion)

export default router