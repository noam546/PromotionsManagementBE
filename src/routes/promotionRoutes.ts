import { Router } from 'express'
import { PromotionController } from '../controllers/promotionController'

const router = Router()

// GET /api/promotions - Get all promotions with pagination and filters
router.get('/', PromotionController.getAllPromotions)

// GET /api/promotions/active - Get active promotions
router.get('/active', PromotionController.getActivePromotions)

// GET /api/promotions/deleted - Get deleted promotions
router.get('/deleted', PromotionController.getDeletedPromotions)

// GET /api/promotions/stats - Get promotion statistics
router.get('/stats', PromotionController.getPromotionStats)

// GET /api/promotions/user-group/:userGroupName - Get promotions by user group
router.get('/user-group/:userGroupName', PromotionController.getPromotionsByUserGroup)

// GET /api/promotions/:id - Get promotion by ID
router.get('/:id', PromotionController.getPromotionById)

// POST /api/promotions - Create new promotion
router.post('/', PromotionController.createPromotion)

// PUT /api/promotions/:id - Update promotion
router.put('/:id', PromotionController.updatePromotion)

// PATCH /api/promotions/:id/deactivate - Deactivate and soft delete promotion
router.patch('/:id/deactivate', PromotionController.deactivatePromotion)

// PATCH /api/promotions/:id/restore - Restore soft deleted promotion
router.patch('/:id/restore', PromotionController.restorePromotion)

// DELETE /api/promotions/:id - Soft delete promotion
router.delete('/:id', PromotionController.deletePromotion)

// DELETE /api/promotions/:id/hard - Hard delete promotion (permanent)
router.delete('/:id/hard', PromotionController.hardDeletePromotion)

export default router