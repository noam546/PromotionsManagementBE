import { Request, Response, NextFunction } from 'express'

export const responseHandler = (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json
    const originalSend = res.send
    const originalStatus = res.status

    res.json = function (data: any) {
        if (data && typeof data === 'object' && 'statusCode' in data && 'body' in data) {
            const controllerResponse = data
            return originalStatus.call(this, controllerResponse.statusCode).json(controllerResponse.body)
        }
        return originalJson.call(this, data)
    }

    res.send = function (data: any) {
        if (data && typeof data === 'object' && 'statusCode' in data && 'body' in data) {
            const controllerResponse = data
            return originalStatus.call(this, controllerResponse.statusCode).send(controllerResponse.body)
        }
        return originalSend.call(this, data)
    }

    next()
} 