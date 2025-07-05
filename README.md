# Promotions Management Backend

A Node.js/TypeScript backend API for managing promotions with MongoDB integration, featuring a clean layered architecture with services and repositories. Includes WebSocket support for real-time updates and comprehensive error handling.

## 🏗️ Architecture

This project follows a clean layered architecture:

```
src/
├── config/           # Configuration management
├── controllers/      # HTTP request handlers
├── database/         # Database connection management
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

## 🚀 Quick Start

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

## 📊 Database Setup

The application uses MongoDB with Mongoose ODM. Make sure MongoDB is running:

```bash
# Start MongoDB (if using local installation)
mongod

# Or use MongoDB Atlas (update DATABASE_URL in .env)
```

## 🔧 Configuration

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

## 📡 API Endpoints

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

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check with database and WebSocket status |

## 🎯 Promotion Types

The system supports three types of promotions:

1. **Basic**: Basic promotions and offers
2. **Epic**: Epic and premium promotions
3. **Common**: Common and standard promotions

## 📝 Data Models

### Promotion Schema

```typescript
interface IPromotion {
  promotionName: string          // Promotion name (required, max 100 chars)
  userGroupName: string         // Target user group (required, max 100 chars)
  type: 'basic' | 'epic' | 'common' // Promotion type (required)
  startDate: Date              // Start date (required)
  endDate: Date                // End date (required)
  createdAt: Date              // Auto-generated timestamp
  updatedAt: Date              // Auto-generated timestamp
}
```

## 🔄 Business Logic

### Promotion Validation
- End date must be after start date (enforced at schema level)
- Type must be one of: basic, epic, common
- Promotion name and user group name are required and trimmed
- Maximum length validation for text fields

### Database Indexes
- Compound index on type, userGroupName, and createdAt
- Text index on promotionName and userGroupName for search
- Indexes on startDate and endDate for date filtering

## 🔌 WebSocket Support

The application includes WebSocket support for real-time updates:

- **Connection**: Clients can connect to the WebSocket server
- **Rooms**: Clients can join/leave the 'promotions' room
- **Events**: Real-time notifications for promotion changes:
  - `promotion_created`: When a new promotion is created
  - `promotion_updated`: When a promotion is updated
  - `promotion_deleted`: When a promotion is deleted

### WebSocket Events

```javascript
// Join promotions room
socket.emit('join_promotions_room')

// Leave promotions room
socket.emit('leave_promotions_room')

// Listen for promotion events
socket.on('promotion_created', (data) => {
  console.log('New promotion:', data.promotion)
})

socket.on('promotion_updated', (data) => {
  console.log('Updated promotion:', data.promotion)
})

socket.on('promotion_deleted', (data) => {
  console.log('Deleted promotion ID:', data.promotionId)
})
```

## 🛠️ Development

### Scripts

- `yarn start`: Build and start the server
- `yarn build`: Compile TypeScript
- `yarn watch`: Watch mode for TypeScript compilation
- `yarn dev`: Development mode with hot reload
- `yarn check-schema`: Check database schema
- `yarn migrate-schema`: Run schema migrations
- `yarn remove-extra-fields`: Remove extra fields from documents

### Adding New Features

1. **Models**: Define data schemas in `src/models/`
2. **Repositories**: Add data access methods in `src/repositories/`
3. **Services**: Implement business logic in `src/services/`
4. **Controllers**: Handle HTTP requests in `src/controllers/`
5. **Routes**: Define API endpoints in `src/routes/`

## 🧪 Testing

The application includes comprehensive error handling and validation:

- Input validation in controllers
- Business logic validation in services
- Database validation in models
- Error handling middleware
- Graceful error responses

## 🔒 Security

- Environment variables for sensitive data
- Input validation and sanitization
- Error handling without exposing internals
- CORS configuration for cross-origin requests
- Graceful shutdown handling

## 📦 Dependencies

### Production Dependencies
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `socket.io`: WebSocket support
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variable management
- `typescript`: TypeScript support

### Development Dependencies
- `@types/express`: Express type definitions
- `@types/mongoose`: Mongoose type definitions
- `@types/cors`: CORS type definitions
- `@types/socket.io`: Socket.io type definitions
- `nodemon`: Development server with auto-restart
- `ts-node`: TypeScript execution for scripts

## 📈 Monitoring

The application includes health monitoring:

- Database connection status
- WebSocket server status
- Server uptime and timestamp
- Graceful shutdown handling

## 🚀 Deployment

1. Build the application:
   ```bash
   yarn build
   ```

2. Set production environment variables:
   ```bash
   NODE_ENV=production
   PORT=8000
   DATABASE_URL=your_mongodb_url
   REACT_APP_URL=your_frontend_url
   ```

3. Start the production server:
   ```bash
   node dist/index.js
   ```

## 📄 License

ISC License
