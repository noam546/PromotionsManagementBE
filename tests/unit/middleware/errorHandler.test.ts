import { Request, Response } from 'express';
import { errorHandler } from '../../../src/middleware/errorHandler';
import { ValidationException, NotFoundException, BaseException } from '../../../src/exceptions';

describe('ErrorHandler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it('should handle ValidationException correctly', () => {
    const error = new ValidationException('Invalid input');
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid input'
    });
  });

  it('should handle NotFoundException correctly', () => {
    const error = new NotFoundException('Resource not found');
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Resource not found'
    });
  });

  it('should handle custom exception correctly', () => {
    const error = new ValidationException('Custom error');
    (error as any).statusCode = 500;
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Custom error'
    });
  });

  it('should handle generic Error correctly', () => {
    const error = new Error('Generic error');
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Generic error'
    });
  });

  it('should handle unknown error types', () => {
    const error = 'String error';
    
    errorHandler(error as any, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal Server Error'
    });
  });

  it('should handle errors with custom status codes', () => {
    const error = new ValidationException('Custom error');
    (error as any).statusCode = 422;
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(422);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Custom error'
    });
  });

  it('should not call next() after handling error', () => {
    const error = new ValidationException('Invalid input');
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
  });
}); 