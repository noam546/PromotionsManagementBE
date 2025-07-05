# Testing Documentation

This document provides information about the testing setup and how to run tests for the Promotions Management Backend.

## Test Structure

The tests are organized into the following structure:

```
tests/
├── setup.ts                    # Global test setup and teardown
├── utils/
│   └── testHelpers.ts         # Common test utilities and helpers
├── unit/                      # Unit tests
│   ├── services/
│   │   └── promotionService.test.ts
│   ├── repositories/
│   │   └── promotionRepository.test.ts
│   └── middleware/
│       └── errorHandler.test.ts
├── integration/               # Integration tests
│   └── controllers/
│       └── promotionController.test.ts
├── e2e/                      # End-to-end tests
│   └── api/
│       └── promotions.test.ts
└── unit/websocket/
    └── websocket.test.ts
```

## Test Categories

### 1. Unit Tests (`tests/unit/`)
- **Services**: Test business logic in isolation
- **Repositories**: Test database operations with real MongoDB
- **Middleware**: Test request/response handling
- **WebSocket**: Test real-time communication

### 2. Integration Tests (`tests/integration/`)
- **Controllers**: Test API endpoint logic with mocked services

### 3. End-to-End Tests (`tests/e2e/`)
- **API**: Test complete HTTP endpoints with real Express app

## Running Tests

### Prerequisites
1. MongoDB running locally or set `MONGODB_TEST_URI` environment variable
2. Node.js and Yarn installed

### Available Commands

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage report
yarn test:coverage

# Run only unit tests
yarn test:unit

# Run only integration tests
yarn test:integration

# Run only end-to-end tests
yarn test:e2e
```

### Environment Variables

Create a `.env.test` file for test-specific configuration:

```env
NODE_ENV=test
MONGODB_TEST_URI=mongodb://localhost:27017/promotions_test
PORT=3001
```

## Test Configuration

### Jest Configuration (`jest.config.js`)
- TypeScript support with `ts-jest`
- Coverage reporting
- Test timeout: 10 seconds
- Setup file: `tests/setup.ts`

### Test Setup (`tests/setup.ts`)
- Database connection for tests
- Global cleanup between tests
- Console mocking to reduce noise

## Test Utilities

### `testHelpers.ts`
Common utilities for creating test data and mocking:

```typescript
// Create test promotion data
const testData = createTestPromotionData({
  promotionName: 'Custom Name',
  type: 'epic'
});

// Mock Express request/response
const req = mockRequest({ body: testData });
const res = mockResponse();
```

## Test Coverage

The tests cover:

### Services (PromotionService)
- Create promotion with validation
- Get promotion by ID
- Get all promotions with pagination and filters
- Update promotion with validation
- Delete promotion
- Error handling for invalid data

### Controllers (PromotionController)
- GET /api/promotions (with filters, pagination, sorting)
- GET /api/promotions/:id
- POST /api/promotions
- PUT /api/promotions/:id
- DELETE /api/promotions/:id
- Error handling and validation

### Repository (PromotionRepository)
- Database CRUD operations
- Query building and filtering
- Pagination and sorting
- Error handling for not found resources

### Middleware
- Error handling for different exception types
- Response formatting
- Status code mapping

### WebSocket
- Socket connection handling
- Room management (join/leave)
- Event emission with timestamps
- Different event types (create, update, delete)

### API Endpoints (E2E)
- Complete HTTP request/response cycle
- Database integration
- Validation and error responses
- Real Express app testing

## Best Practices

### Writing Tests
1. **Arrange-Act-Assert**: Structure tests clearly
2. **Descriptive names**: Use clear test descriptions
3. **Isolation**: Each test should be independent
4. **Mocking**: Mock external dependencies appropriately
5. **Coverage**: Aim for high test coverage

### Test Data
- Use `createTestPromotionData()` for consistent test data
- Override specific fields as needed
- Clean up database between tests

### Error Testing
- Test both success and failure scenarios
- Verify correct error types and messages
- Test edge cases and invalid inputs

## Debugging Tests

### Common Issues
1. **Database connection**: Ensure MongoDB is running
2. **Port conflicts**: Use different ports for test environment
3. **Async operations**: Use proper async/await patterns
4. **Mocking**: Ensure mocks are properly set up

### Debug Commands
```bash
# Run specific test file
yarn test tests/unit/services/promotionService.test.ts

# Run tests with verbose output
yarn test --verbose

# Run tests and watch for changes
yarn test:watch
```

## Continuous Integration

The test suite is designed to run in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run tests
  run: yarn test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Performance

- Unit tests: ~100ms per test
- Integration tests: ~200ms per test  
- E2E tests: ~500ms per test
- Total suite: ~30 seconds

## Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure all tests pass
3. Maintain or improve coverage
4. Update this documentation if needed 