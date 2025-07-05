import { PromotionController } from '../../../src/controllers/promotionController';
import PromotionService from '../../../src/services/promotionService';
import { ValidationException, NotFoundException } from '../../../src/exceptions';
import { createTestPromotionData, mockRequest, mockResponse } from '../../utils/testHelpers';
import { CreatePromotionData, PromotionType } from '../../../src/repositories/types';

// Mock the service
jest.mock('../../../src/services/promotionService');
const mockPromotionService = PromotionService as jest.Mocked<typeof PromotionService>;

// Mock the emitPromotionEvent function
jest.mock('../../../src/index', () => ({
  emitPromotionEvent: jest.fn()
}));

describe('PromotionController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPromotions', () => {
    it('should return all promotions with default pagination', async () => {
      const mockPromotions = [
        {
          id: '507f1f77bcf86cd799439011',
          promotionName: 'Test Promotion 1',
          userGroupName: 'Test Group',
          type: 'basic' as PromotionType,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-02'),
        }
      ];

      const mockResult = {
        data: mockPromotions,
        pagination: {
          total: 1,
          page: 1,
          totalPages: 1,
          limit: 10
        }
      };

      mockPromotionService.getAllPromotions.mockResolvedValue(mockResult);

      const req = mockRequest({
        query: {}
      });
      const res = mockResponse();

      await PromotionController.getAllPromotions(req as any, res);

      expect(mockPromotionService.getAllPromotions).toHaveBeenCalledWith(
        {},
        1,
        10,
        { field: 'createdAt', order: 'desc' }
      );
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 200,
        body: {
          data: mockPromotions,
          pagination: mockResult.pagination,
        }
      });
    });

    it('should handle custom pagination parameters', async () => {
      const mockResult = {
        data: [],
        pagination: {
          total: 0,
          page: 2,
          totalPages: 0,
          limit: 5
        }
      };

      mockPromotionService.getAllPromotions.mockResolvedValue(mockResult);

      const req = mockRequest({
        query: {
          page: '2',
          limit: '5',
          sortBy: 'promotionName',
          sortOrder: 'asc',
          type: 'basic',
          userGroupName: 'Test Group'
        }
      });
      const res = mockResponse();

      await PromotionController.getAllPromotions(req as any, res);

      expect(mockPromotionService.getAllPromotions).toHaveBeenCalledWith(
        {
          type: 'basic',
          userGroupName: 'Test Group',
          search: undefined,
          startDate: undefined,
          endDate: undefined,
        },
        2,
        5,
        { field: 'promotionName', order: 'asc' }
      );
    });

    it('should throw ValidationException for invalid pagination', async () => {
      const req = mockRequest({
        query: {
          page: '0',
          limit: '-1'
        }
      });
      const res = mockResponse();

      await expect(PromotionController.getAllPromotions(req as any, res))
        .rejects
        .toThrow(ValidationException);
    });

    it('should throw ValidationException for invalid sort order', async () => {
      const req = mockRequest({
        query: {
          sortOrder: 'invalid'
        }
      });
      const res = mockResponse();

      await expect(PromotionController.getAllPromotions(req as any, res))
        .rejects
        .toThrow(ValidationException);
    });
  });

  describe('getPromotionById', () => {
    it('should return a promotion by id', async () => {
      const mockPromotion = {
        id: '507f1f77bcf86cd799439011',
        promotionName: 'Test Promotion',
        userGroupName: 'Test Group',
        type: 'basic' as PromotionType,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02'),
      };

      mockPromotionService.getPromotionById.mockResolvedValue(mockPromotion);

      const req = mockRequest({
        params: { id: '507f1f77bcf86cd799439011' }
      });
      const res = mockResponse();

      await PromotionController.getPromotionById(req as any, res);

      expect(mockPromotionService.getPromotionById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 200,
        body: {
          data: mockPromotion,
        }
      });
    });

    it('should throw NotFoundException when promotion not found', async () => {
      mockPromotionService.getPromotionById.mockRejectedValue(new NotFoundException('Promotion not found'));

      const req = mockRequest({
        params: { id: 'nonexistent' }
      });
      const res = mockResponse();

      await expect(PromotionController.getPromotionById(req as any, res))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('createPromotion', () => {
    it('should create a promotion successfully', async () => {
      const testData = createTestPromotionData();
      const mockPromotion = {
        id: '507f1f77bcf86cd799439011',
        ...testData
      };

      mockPromotionService.createPromotion.mockResolvedValue(mockPromotion);

      const req = mockRequest({
        body: testData
      });
      const res = mockResponse();

      await PromotionController.createPromotion(req as any, res);

      expect(mockPromotionService.createPromotion).toHaveBeenCalledWith(testData);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 201,
        body: {
          data: mockPromotion
        }
      });
    });

    it('should throw ValidationException for invalid data', async () => {
      const invalidData = createTestPromotionData({
        startDate: new Date('2024-01-02'),
        endDate: new Date('2024-01-01')
      });

      mockPromotionService.createPromotion.mockRejectedValue(new ValidationException('Invalid date range'));

      const req = mockRequest({
        body: invalidData
      });
      const res = mockResponse();

      await expect(PromotionController.createPromotion(req as any, res))
        .rejects
        .toThrow(ValidationException);
    });
  });

  describe('updatePromotion', () => {
    it('should update a promotion successfully', async () => {
      const updateData = {
        promotionName: 'Updated Promotion'
      };
      const mockPromotion = {
        id: '507f1f77bcf86cd799439011',
        promotionName: 'Updated Promotion',
        userGroupName: 'Test Group',
        type: 'basic' as PromotionType,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02'),
      };

      mockPromotionService.updatePromotion.mockResolvedValue(mockPromotion);

      const req = mockRequest({
        params: { id: '507f1f77bcf86cd799439011' },
        body: updateData
      });
      const res = mockResponse();

      await PromotionController.updatePromotion(req as any, res);

      expect(mockPromotionService.updatePromotion).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateData);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 200,
        body: {
          data: mockPromotion
        }
      });
    });

    it('should throw NotFoundException when promotion not found', async () => {
      const updateData = { promotionName: 'Updated Promotion' };
      mockPromotionService.updatePromotion.mockRejectedValue(new NotFoundException('Promotion not found'));

      const req = mockRequest({
        params: { id: 'nonexistent' },
        body: updateData
      });
      const res = mockResponse();

      await expect(PromotionController.updatePromotion(req as any, res))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('deletePromotion', () => {
    it('should delete a promotion successfully', async () => {
      mockPromotionService.deletePromotion.mockResolvedValue(true);

      const req = mockRequest({
        params: { id: '507f1f77bcf86cd799439011' }
      });
      const res = mockResponse();

      await PromotionController.deletePromotion(req as any, res);

      expect(mockPromotionService.deletePromotion).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(res.json).toHaveBeenCalledWith({
        statusCode: 204,
        body: {}
      });
    });

    it('should throw NotFoundException when promotion not found', async () => {
      mockPromotionService.deletePromotion.mockRejectedValue(new NotFoundException('Promotion not found'));

      const req = mockRequest({
        params: { id: 'nonexistent' }
      });
      const res = mockResponse();

      await expect(PromotionController.deletePromotion(req as any, res))
        .rejects
        .toThrow(NotFoundException);
    });
  });
}); 