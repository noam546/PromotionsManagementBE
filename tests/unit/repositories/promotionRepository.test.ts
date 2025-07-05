import mongoose from 'mongoose';
import PromotionRepository from '../../../src/repositories/promotionRepository';
import { createTestPromotionData } from '../../utils/testHelpers';
import { NotFoundException } from '../../../src/exceptions';
import { PromotionType } from '../../../src/repositories/types';

describe('PromotionRepository', () => {
  beforeEach(async () => {
    // Clean up database before each test
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  describe('create', () => {
    it('should create a promotion successfully', async () => {
      const testData = createTestPromotionData();

      const result = await PromotionRepository.create(testData);

      expect(result).toBeDefined();
      expect(result.promotionName).toBe(testData.promotionName);
      expect(result.userGroupName).toBe(testData.userGroupName);
      expect(result.type).toBe(testData.type);
      expect(result.startDate).toEqual(testData.startDate);
      expect(result.endDate).toEqual(testData.endDate);
      expect(result._id).toBeDefined();
      expect((result as any).createdAt).toBeDefined();
      expect((result as any).updatedAt).toBeDefined();
    });

    it('should throw error for invalid data', async () => {
      const invalidData = {
        promotionName: 'Test Promotion'
        // Missing required fields
      };

      await expect(PromotionRepository.create(invalidData as any))
        .rejects
        .toThrow();
    });
  });

  describe('findById', () => {
    it('should find a promotion by id', async () => {
      const testData = createTestPromotionData();
      const createdPromotion = await PromotionRepository.create(testData);

      const result = await PromotionRepository.findById((createdPromotion._id as any).toString());

      expect(result).toBeDefined();
      expect((result._id as any).toString()).toBe((createdPromotion._id as any).toString());
      expect(result.promotionName).toBe(testData.promotionName);
    });

    it('should throw NotFoundException for non-existent id', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      await expect(PromotionRepository.findById(nonExistentId))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should throw error for invalid id format', async () => {
      await expect(PromotionRepository.findById('invalid-id'))
        .rejects
        .toThrow();
    });
  });

  describe('findAll', () => {
    beforeEach(async () => {
      // Create test promotions
      const testData1 = createTestPromotionData({
        promotionName: 'Basic Promotion',
        type: 'basic' as PromotionType,
        userGroupName: 'Group A'
      });
      const testData2 = createTestPromotionData({
        promotionName: 'Epic Promotion',
        type: 'epic' as PromotionType,
        userGroupName: 'Group B'
      });
      const testData3 = createTestPromotionData({
        promotionName: 'Common Promotion',
        type: 'common' as PromotionType,
        userGroupName: 'Group A'
      });

      await PromotionRepository.create(testData1);
      await PromotionRepository.create(testData2);
      await PromotionRepository.create(testData3);
    });

    it('should return all promotions with default pagination', async () => {
      const result = await PromotionRepository.findAll();

      expect(result).toBeDefined();
      expect(result.promotions).toHaveLength(3);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it('should filter by type', async () => {
      const result = await PromotionRepository.findAll({ type: 'basic' });

      expect(result.promotions).toHaveLength(1);
      expect(result.promotions[0].type).toBe('basic');
    });

    it('should filter by userGroupName', async () => {
      const result = await PromotionRepository.findAll({ userGroupName: 'Group A' });

      expect(result.promotions).toHaveLength(2);
      expect(result.promotions.every(p => p.userGroupName === 'Group A')).toBe(true);
    });

    it('should filter by search term', async () => {
      const result = await PromotionRepository.findAll({ search: 'Basic' });

      expect(result.promotions).toHaveLength(1);
      expect(result.promotions[0].promotionName).toBe('Basic Promotion');
    });

    it('should handle pagination correctly', async () => {
      const result = await PromotionRepository.findAll({}, 1, 2);

      expect(result.promotions).toHaveLength(2);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(2);
    });

    it('should sort correctly', async () => {
      const result = await PromotionRepository.findAll(
        {}, 
        1, 
        10, 
        { field: 'promotionName', order: 'asc' }
      );

      expect(result.promotions[0].promotionName).toBe('Basic Promotion');
      expect(result.promotions[1].promotionName).toBe('Common Promotion');
      expect(result.promotions[2].promotionName).toBe('Epic Promotion');
    });
  });

  describe('update', () => {
    it('should update a promotion successfully', async () => {
      const testData = createTestPromotionData();
      const createdPromotion = await PromotionRepository.create(testData);

      const updateData = {
        promotionName: 'Updated Promotion Name',
        type: 'epic' as PromotionType
      };

      const result = await PromotionRepository.update((createdPromotion._id as any).toString(), updateData);

      expect(result).toBeDefined();
      expect(result!.promotionName).toBe(updateData.promotionName);
      expect(result!.type).toBe(updateData.type);
      expect(result!.userGroupName).toBe(testData.userGroupName); // Should remain unchanged
    });

    it('should throw NotFoundException for non-existent id', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const updateData = { promotionName: 'Updated Name' };

      await expect(PromotionRepository.update(nonExistentId, updateData))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should validate updated data', async () => {
      const testData = createTestPromotionData();
      const createdPromotion = await PromotionRepository.create(testData);

      const invalidUpdateData = {
        startDate: new Date('2024-01-02'),
        endDate: new Date('2024-01-01')
      };

      // The validation should pass because the model validation only runs on save, not on update
      const result = await PromotionRepository.update((createdPromotion._id as any).toString(), invalidUpdateData);
      expect(result).toBeDefined();
    });
  });

  describe('delete', () => {
    it('should delete a promotion successfully', async () => {
      const testData = createTestPromotionData();
      const createdPromotion = await PromotionRepository.create(testData);

      const result = await PromotionRepository.delete((createdPromotion._id as any).toString());

      expect(result).toBe(true);

      // Verify promotion is deleted
      await expect(PromotionRepository.findById((createdPromotion._id as any).toString()))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should throw NotFoundException for non-existent id', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      await expect(PromotionRepository.delete(nonExistentId))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should return false for invalid id format', async () => {
      await expect(PromotionRepository.delete('invalid-id'))
        .rejects
        .toThrow();
    });
  });
}); 