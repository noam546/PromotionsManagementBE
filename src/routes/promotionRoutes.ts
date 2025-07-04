import { Router } from 'express'
import { PromotionController } from '../controllers/promotionController'

const router = Router()

// GET /api/promotions - Get all promotions with pagination filters and sorting
router.get('/', PromotionController.getAllPromotions)

// GET /api/promotions/:id - Get promotion by ID
router.get('/:id', PromotionController.getPromotionById)

// POST /api/promotions - Create new promotion
router.post('/', PromotionController.createPromotion)

// PUT /api/promotions/:id - Update promotion
router.put('/:id', PromotionController.updatePromotion)

// DELETE /api/promotions/:id - Delete promotion
router.delete('/:id', PromotionController.deletePromotion)

export { router as PromotionRoutes }