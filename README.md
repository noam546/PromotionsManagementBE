# Promotions Management Backend

A Node.js/TypeScript backend API for managing promotions with MongoDB integration, featuring a clean layered architecture with services and repositories. Includes WebSocket support for real-time updates and comprehensive error handling.

## Architecture

This project follows a clean layered architecture:

```
src/
├── config/           # Configuration management
├── controllers/      # HTTP request handlers
├── database/         # Database connection management
├── exceptions/       # Custom exception classes
├── middleware/       # Express middleware
├── models/          # Mongoose schemas and models
├── repositories/    # Data access layer
├── routes/          # API route definitions
├── services/        # Business logic layer
└── utils/           # Utility functions
```

### Layers:
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic and data transformation
- **Repositories**: Database operations and data access
- **Models**: Data schemas and validation
- **Middleware**: Request/response processing and error handling

## Quick Start

1. **Install dependencies**:
   ```bash
   yarn install
   ```

2. **Set up environment**:
   ```bash
   cp .env.local .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB** (make sure MongoDB is running locally or update DATABASE_URL)

4. **Start the server**:
   ```bash
   yarn start
   ```

## Database Setup

The application uses MongoDB with Mongoose ODM. Make sure MongoDB is running:

```bash
# Start MongoDB (if using local installation)
mongod

# Or use MongoDB Atlas (update DATABASE_URL in .env)
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Server Configuration
PORT=8000
NODE_ENV=development
REACT_APP_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=mongodb://localhost:27017
```

### Configuration Structure

The configuration is centralized in `src/config/index.ts` and provides:
- Type-safe configuration with TypeScript interfaces
- Environment variable loading with defaults
- Support for both `.env` and `.env.local` files
- Environment-specific settings

## API Endpoints

### Promotions Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/promotions` | Get all promotions (with pagination, filters & sorting) |
| GET | `/api/promotions/:id` | Get promotion by ID |
| POST | `/api/promotions` | Create new promotion |
| PUT | `/api/promotions/:id` | Update promotion |
| DELETE | `/api/promotions/:id` | Delete promotion |

### Query Parameters

- `page`: Page number for pagination (default: 1)
- `limit`: Number of items per page (default: 10)
- `sortBy`: Field to sort by (default: 'createdAt')
- `sortOrder`: Sort order - 'asc' or 'desc' (default: 'desc')
- `type`: Filter by promotion type (basic, epic, common)
- `userGroupName`: Filter by user group name
- `search`: Search in promotionName and userGroupName
- `startDate`: Filter by start date
- `endDate`: Filter by end date

## Promotion Types

The system supports three types of promotions:

1. **Basic**: Basic promotions and offers
2. **Epic**: Epic and premium promotions
3. **Common**: Common and standard promotions

## Data Models

### Promotion Schema

```typescript
interface IPromotion {
  promotionName: string          // Promotion name (required, max 100 chars)
  userGroupName: string         // Target user group (required, max 100 chars)
  type: 'basic' | 'epic' | 'common' // Promotion type (required)
  startDate: Date              // Start date (required)
  endDate: Date                // End date (required)
}
```

## Development

### Scripts

- `yarn start`: Build and start the server
- `yarn build`: Compile TypeScript
- `yarn watch`: Watch mode for TypeScript compilation
- `yarn dev`: Development mode with hot reload
- `yarn check-schema`: Check database schema
- `yarn migrate-schema`: Run schema migrations

### Adding New Features

1. **Models**: Define data schemas in `src/models/`
2. **Repositories**: Add data access methods in `src/repositories/`
3. **Services**: Implement business logic in `src/services/`
4. **Controllers**: Handle HTTP requests in `src/controllers/`
5. **Routes**: Define API endpoints in `src/routes/`
6. **Middleware**: Add custom middleware in `src/middleware/`
7. **Exceptions**: Create custom exceptions in `src/exceptions/`


## Dependencies

### Production Dependencies
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `socket.io`: WebSocket support
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variable management
- `typescript`: TypeScript support
