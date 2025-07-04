import { Request, Response, NextFunction } from 'express'
import config from '../config'
import { CustomError } from './types'
import { NotFoundException, BaseException } from '../exceptions'

export const errorHandler = (
    err: Error | BaseException | CustomError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let statusCode = 500
    let message = 'Internal Server Error'

    if (err instanceof BaseException) {
        statusCode = err.statusCode
        message = err.message
    } else if ('statusCode' in err && err.statusCode) {
        statusCode = err.statusCode
        message = err.message || 'Internal Server Error'
    } else {
        message = err.message || 'Internal Server Error'
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(config.nodeEnv === 'development' && { stack: err.stack })
    })
}

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
    const error = NotFoundException.resourceNotFound('route', req.originalUrl)
    next(error)
}