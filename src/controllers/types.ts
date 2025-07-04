
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

