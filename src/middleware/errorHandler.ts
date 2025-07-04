import { Request, Response, NextFunction } from 'express'
import config from '../config'
import { CustomError } from './types'


export const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'

    res.status(statusCode).json({
        success: false,
        message,
        ...(config.nodeEnv === 'development' && { stack: err.stack })
    })
}

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
    const error = new Error(`Not Found - ${req.originalUrl}`) as CustomError
    error.statusCode = 404
    next(error)
}