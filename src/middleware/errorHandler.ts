import { Request, Response, NextFunction } from 'express'
import config from '../config'
import { CustomError } from './types'
import { BaseException } from '../exceptions'

export const errorHandler = (
    err: Error | BaseException | CustomError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let statusCode = 500
    let message = 'Internal Server Error'
    let details: any = undefined

    if (err instanceof BaseException) {
        statusCode = err.statusCode
        message = err.message
        
        // Include details if available
        if ('details' in err && err.details) {
            details = err.details
        }
    } else if ('statusCode' in err && err.statusCode) {
        statusCode = err.statusCode
        message = err.message || 'Internal Server Error'
    } else {
        message = err.message || 'Internal Server Error'
    }

    const response: any = {
        success: false,
        message,
    }

    if (details) {
        response.details = details
    }

    if (config.nodeEnv === 'development') {
        response.stack = err.stack
    }

    res.status(statusCode).json(response)
}