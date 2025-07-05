import { PromotionService } from '../../../src/services/promotionService';
import PromotionRepository from '../../../src/repositories/promotionRepository';
import { ValidationException, NotFoundException } from '../../../src/exceptions';
import { createTestPromotionData } from '../../utils/testHelpers';
import { CreatePromotionData, UpdatePromotionData } from '../../../src/repositories/types';

// Mock the repository
jest.mock('../../../src/repositories/promotionRepository');
const mockPromotionRepository = PromotionRepository as jest.Mocked<typeof PromotionRepository>;

describe('PromotionService', () => {
  let promotionService: PromotionService;

  beforeEach(() => {
    promotionService = new PromotionService();
    jest.clearAllMocks();
  });

  describe('createPromotion', () => {
    it('should create a promotion successfully', async () => {
      const testData = createTestPromotionData();
      const mockPromotion = {
        _id: '507f1f77bcf86cd799439011',
        ...testData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPromotionRepository.create.mockResolvedValue(mockPromotion as any);

      const result = await promotionService.createPromotion(testData);

      expect(mockPromotionRepository.create).toHaveBeenCalledWith(testData);
      expect(result).toEqual({
        id: mockPromotion._id,
        promotionName: testData.promotionName,
        userGroupName: testData.userGroupName,
        type: testData.type,
        startDate: testData.startDate,
        endDate: testData.endDate,
      });
    });

    it('should throw ValidationException when startDate is after endDate', async () => {
      const testData = createTestPromotionData({
        startDate: new Date('2024-01-02'),
        endDate: new Date('2024-01-01')
      });

      await expect(promotionService.createPromotion(testData))
        .rejects
        .toThrow(ValidationException);
    });

    it('should throw ValidationException when startDate equals endDate', async () => {
      const sameDate = new Date('2024-01-01');
      const testData = createTestPromotionData({
        startDate: sameDate,
        endDate: sameDate
      });

      await expect(promotionService.createPromotion(testData))
        .rejects
        .toThrow(ValidationException);
    });
  });

  describe('getPromotionById', () => {
    it('should return a promotion by id', async () => {
      const mockPromotion = {
        _id: '507f1f77bcf86cd799439011',
        promotionName: 'Test Promotion',
        userGroupName: 'Test Group',
        type: 'basic',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02'),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPromotionRepository.findById.mockResolvedValue(mockPromotion as any);

      const result = await promotionService.getPromotionById('507f1f77bcf86cd799439011');

      expect(mockPromotionRepository.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual({
        id: mockPromotion._id,
        promotionName: mockPromotion.promotionName,
        userGroupName: mockPromotion.userGroupName,
        type: mockPromotion.type,
        startDate: mockPromotion.startDate,
        endDate: mockPromotion.endDate,
      });
    });

    it('should throw NotFoundException when promotion not found', async () => {
      mockPromotionRepository.findById.mockRejectedValue(new NotFoundException('Promotion not found'));

      await expect(promotionService.getPromotionById('nonexistent'))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('getAllPromotions', () => {
    it('should return paginated promotions with default parameters', async () => {
      const mockPromotions = [
        {
          _id: '507f1f77bcf86cd799439011',
          promotionName: 'Test Promotion 1',
          userGroupName: 'Test Group',
          type: 'basic',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-02'),
        },
        {
          _id: '507f1f77bcf86cd799439012',
          promotionName: 'Test Promotion 2',
          userGroupName: 'Test Group',
          type: 'epic',
          startDate: new Date('2024-01-03'),
          endDate: new Date('2024-01-04'),
        }
      ];

      const mockResult = {
        promotions: mockPromotions,
        total: 2,
        page: 1,
        totalPages: 1
      };

      mockPromotionRepository.findAll.mockResolvedValue(mockResult as any);

      const result = await promotionService.getAllPromotions();

      expect(mockPromotionRepository.findAll).toHaveBeenCalledWith(
        {},
        1,
        10,
        { field: 'createdAt', order: 'desc' }
      );
      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.page).toBe(1);
    });

    it('should apply filters and pagination correctly', async () => {
      const filters = {
        type: 'basic',
        userGroupName: 'Test Group',
        search: 'test'
      };

      const mockResult = {
        promotions: [],
        total: 0,
        page: 2,
        totalPages: 0
      };

      mockPromotionRepository.findAll.mockResolvedValue(mockResult as any);

      await promotionService.getAllPromotions(filters, 2, 5, { field: 'promotionName', order: 'asc' });

      expect(mockPromotionRepository.findAll).toHaveBeenCalledWith(
        filters,
        2,
        5,
        { field: 'promotionName', order: 'asc' }
      );
    });
  });

  describe('updatePromotion', () => {
    it('should update a promotion successfully', async () => {
      const updateData: UpdatePromotionData = {
        promotionName: 'Updated Promotion'
      };

      const mockPromotion = {
        _id: '507f1f77bcf86cd799439011',
        promotionName: 'Updated Promotion',
        userGroupName: 'Test Group',
        type: 'basic',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02'),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPromotionRepository.update.mockResolvedValue(mockPromotion as any);

      const result = await promotionService.updatePromotion('507f1f77bcf86cd799439011', updateData);

      expect(mockPromotionRepository.update).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateData);
      expect(result.promotionName).toBe('Updated Promotion');
    });

    it('should throw ValidationException when updated dates are invalid', async () => {
      const updateData: UpdatePromotionData = {
        startDate: new Date('2024-01-02'),
        endDate: new Date('2024-01-01')
      };

      await expect(promotionService.updatePromotion('507f1f77bcf86cd799439011', updateData))
        .rejects
        .toThrow(ValidationException);
    });

    it('should not throw error when only one date is provided', async () => {
      const updateData: UpdatePromotionData = {
        startDate: new Date('2024-01-01')
      };

      const mockPromotion = {
        _id: '507f1f77bcf86cd799439011',
        promotionName: 'Test Promotion',
        userGroupName: 'Test Group',
        type: 'basic',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02'),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPromotionRepository.update.mockResolvedValue(mockPromotion as any);

      await expect(promotionService.updatePromotion('507f1f77bcf86cd799439011', updateData))
        .resolves
        .toBeDefined();
    });
  });

  describe('deletePromotion', () => {
    it('should delete a promotion successfully', async () => {
      mockPromotionRepository.delete.mockResolvedValue(true);

      const result = await promotionService.deletePromotion('507f1f77bcf86cd799439011');

      expect(mockPromotionRepository.delete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toBe(true);
    });

    it('should return false when promotion deletion fails', async () => {
      mockPromotionRepository.delete.mockResolvedValue(false);

      const result = await promotionService.deletePromotion('507f1f77bcf86cd799439011');

      expect(result).toBe(false);
    });
  });
}); 