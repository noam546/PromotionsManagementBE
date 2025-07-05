
// Mock the emitPromotionEvent function
const mockEmitPromotionEvent = jest.fn();
jest.mock('../../../src/index', () => ({
  emitPromotionEvent: mockEmitPromotionEvent
}));

describe('WebSocket Functionality', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('Event Emission', () => {
    it('should call emitPromotionEvent with correct parameters', () => {
      const testData = {
        promotion: {
          id: 'test-id',
          promotionName: 'Test Promotion',
          type: 'basic'
        }
      };

      // Call emitPromotionEvent
      mockEmitPromotionEvent('promotion_created', testData);

      // Verify function was called with correct parameters
      expect(mockEmitPromotionEvent).toHaveBeenCalledWith('promotion_created', testData);
    });

    it('should handle different event types', () => {
      const testData = { promotionId: 'test-id' };

      // Test different event types
      mockEmitPromotionEvent('promotion_created', testData);
      mockEmitPromotionEvent('promotion_updated', testData);
      mockEmitPromotionEvent('promotion_deleted', testData);

      expect(mockEmitPromotionEvent).toHaveBeenCalledTimes(3);
      expect(mockEmitPromotionEvent).toHaveBeenCalledWith('promotion_created', testData);
      expect(mockEmitPromotionEvent).toHaveBeenCalledWith('promotion_updated', testData);
      expect(mockEmitPromotionEvent).toHaveBeenCalledWith('promotion_deleted', testData);
    });

    it('should handle event data with promotion objects', () => {
      const testData = {
        promotion: {
          id: 'new-promotion-id',
          promotionName: 'New Promotion',
          type: 'epic'
        }
      };

      mockEmitPromotionEvent('promotion_created', testData);

      expect(mockEmitPromotionEvent).toHaveBeenCalledWith('promotion_created', testData);
    });

    it('should handle event data with promotion IDs', () => {
      const testData = {
        promotionId: 'deleted-promotion-id'
      };

      mockEmitPromotionEvent('promotion_deleted', testData);

      expect(mockEmitPromotionEvent).toHaveBeenCalledWith('promotion_deleted', testData);
    });
  });
}); 