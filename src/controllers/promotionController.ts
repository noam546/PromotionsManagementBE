import { emitPromotionEvent } from '../index'
import { PromotionService, PromotionResponse } from '../services'
import { 
    ControllerResponse, 
    GetAllPromotionsRequest, 
    GetPromotionByIdRequest, 
    CreatePromotionRequest, 
    UpdatePromotionRequest, 
    DeletePromotionRequest,
    GetAllPromotionsResponse,
    GetPromotionByIdResponse,
    CreatePromotionResponse,
    UpdatePromotionResponse,
    DeletePromotionResponse
} from './types'
import { DEFAULT_SORT_FIELD, DESC } from '../utils'
import { ValidationException } from '../exceptions'

export class PromotionController {

    // GET /api/promotions
    public static async getAllPromotions(req: GetAllPromotionsRequest, res: GetAllPromotionsResponse): Promise<ControllerResponse<PromotionResponse[]>> {
        const { query: { page: pageStr, limit: limitStr, sortBy, sortOrder: sortOrderStr, type, userGroupName, search, startDate: startDateStr, endDate: endDateStr } } = req
        
        const page = parseInt(pageStr || '1')
        const limit = parseInt(limitStr || '10')
        
        if (page < 1 || limit < 1) {
            throw ValidationException.invalidPagination({ page, limit })
        }
        
        const sortField = sortBy || DEFAULT_SORT_FIELD
        const sortOrder = sortOrderStr || DESC
        
        if (sortOrder !== 'asc' && sortOrder !== 'desc') {
            throw ValidationException.invalidSortOrder({ sortOrder })
        }
        
        const filters = {
            type,
            userGroupName,
            search,
            startDate: startDateStr ? new Date(startDateStr) : undefined,
            endDate: endDateStr ? new Date(endDateStr) : undefined,
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
    public static async getPromotionById(req: GetPromotionByIdRequest, res: GetPromotionByIdResponse): Promise<ControllerResponse<PromotionResponse>> {
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
    static async createPromotion(req: CreatePromotionRequest, res: CreatePromotionResponse): Promise<ControllerResponse<PromotionResponse>> {
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
    static async updatePromotion(req: UpdatePromotionRequest, res: UpdatePromotionResponse): Promise<ControllerResponse<PromotionResponse>> {
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
    static async deletePromotion(req: DeletePromotionRequest, res: DeletePromotionResponse): Promise<ControllerResponse<void>> {
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