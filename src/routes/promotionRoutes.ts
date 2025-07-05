import { Router } from 'express'
import { PromotionController } from '../controllers/promotionController'
import { asyncHandler } from '../utils'

const router = Router()

// GET /api/promotions - Get all promotions with pagination filters and sorting
router.get('/', asyncHandler(PromotionController.getAllPromotions))

// GET /api/promotions/:id - Get promotion by ID
router.get('/:id', asyncHandler(PromotionController.getPromotionById))

// POST /api/promotions - Create new promotion
router.post('/', asyncHandler(PromotionController.createPromotion))

// PUT /api/promotions/:id - Update promotion
router.put('/:id', asyncHandler(PromotionController.updatePromotion))

// DELETE /api/promotions/:id - Delete promotion
router.delete('/:id', asyncHandler(PromotionController.deletePromotion))

export { router as PromotionRoutes }