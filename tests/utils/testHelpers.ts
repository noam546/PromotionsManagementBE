import { CreatePromotionData } from '../../src/repositories/types';
import { PromotionType } from '../../src/repositories';

export const createTestPromotionData = (overrides: Partial<CreatePromotionData> = {}): CreatePromotionData => {
  const now = new Date();
  const startDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
  const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Next week

  return {
    promotionName: 'Test Promotion',
    userGroupName: 'Test Group',
    type: 'basic' as PromotionType,
    startDate,
    endDate,
    ...overrides
  };
};

export const createMultipleTestPromotions = (count: number, baseData?: Partial<CreatePromotionData>) => {
  return Array.from({ length: count }, (_, index) => 
    createTestPromotionData({
      promotionName: `Test Promotion ${index + 1}`,
      userGroupName: `Test Group ${index + 1}`,
      ...baseData
    })
  );
};

export const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

export const mockRequest = (overrides: any = {}) => {
  return {
    body: {},
    params: {},
    query: {},
    ...overrides
  };
};

export const waitForAsync = (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms)); 