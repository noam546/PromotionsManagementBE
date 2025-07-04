import { Request, Response } from 'express'
import { PromotionResponse } from '../services'
import { SortOrder } from '../repositories'

export interface ApiResponse<T = any> {
    data?: T
    message?: string
    error?: string
    pagination?: {
        total: number
        page: number
        totalPages: number
        limit: number
    }
}

export interface ControllerResponse<T = any> {
    statusCode: number
    body: ApiResponse<T>
}

// Typed request interfaces
export interface GetAllPromotionsQuery {
    page?: string
    limit?: string
    sortBy?: string
    sortOrder?: SortOrder
    type?: string
    userGroupName?: string
    search?: string
    startDate?: string
    endDate?: string
    [key: string]: string | undefined
}

export interface GetPromotionByIdParams {
    id: string
    [key: string]: string
}

export interface UpdatePromotionParams {
    id: string
    [key: string]: string
}

export interface DeletePromotionParams {
    id: string
    [key: string]: string
}

// Request types using generics
export type GetAllPromotionsRequest = Request<{}, {}, {}, GetAllPromotionsQuery>
export type GetPromotionByIdRequest = Request<GetPromotionByIdParams>
export type UpdatePromotionRequest = Request<UpdatePromotionParams, {}, any>
export type DeletePromotionRequest = Request<DeletePromotionParams>
export type CreatePromotionRequest = Request<{}, {}, any>

// Typed response types
export type GetAllPromotionsResponse = Response<ApiResponse<PromotionResponse[]>>
export type GetPromotionByIdResponse = Response<ApiResponse<PromotionResponse>>
export type CreatePromotionResponse = Response<ApiResponse<PromotionResponse>>
export type UpdatePromotionResponse = Response<ApiResponse<PromotionResponse>>
export type DeletePromotionResponse = Response<ApiResponse<void>>

