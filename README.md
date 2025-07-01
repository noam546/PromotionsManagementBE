# Promotions Management Backend

A Node.js/TypeScript backend API for managing promotions with MongoDB integration, featuring a clean layered architecture with services and repositories. Includes soft deletion functionality for data preservation.

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
└── services/        # Business logic layer
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
   cp env.local .env
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

# Database Configuration
DATABASE_URL=mongodb://localhost:27017
DATABASE_NAME=promotions_db

```

### Configuration Structure

The configuration is centralized in `src/config/index.ts` and provides:
- Type-safe configuration with TypeScript interfaces
- Environment variable loading with defaults
- Validation for required variables
- Environment-specific settings

## 📡 API Endpoints

### Promotions Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/promotions` | Get all promotions (with pagination & filters) |
| GET | `/api/promotions/active` | Get active promotions |
| GET | `/api/promotions/deleted` | Get deleted promotions |
| GET | `/api/promotions/stats` | Get promotion statistics |
| GET | `/api/promotions/user-group/:userGroupName` | Get promotions by user group |
| GET | `/api/promotions/:id` | Get promotion by ID |
| POST | `/api/promotions` | Create new promotion |
| PUT | `/api/promotions/:id` | Update promotion |
| PATCH | `/api/promotions/:id/deactivate` | Deactivate and soft delete promotion |
| PATCH | `/api/promotions/:id/restore` | Restore soft deleted promotion |
| DELETE | `/api/promotions/:id` | Soft delete promotion |
| DELETE | `/api/promotions/:id/hard` | Hard delete promotion (permanent) |

### Query Parameters

- `page`: Page number for pagination
- `limit`: Number of items per page
- `isActive`: Filter by active status
- `type`: Filter by promotion type (event, sale, bonus)
- `userGroupName`: Filter by user group name
- `search`: Search in name and userGroupName
- `startDate`: Filter by start date
- `endDate`: Filter by end date
- `includeDeleted`: Include deleted promotions in results (true/false)

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check with database status |

## 🎯 Promotion Types

The system supports three types of promotions:

1. **Event**: Special events and campaigns
2. **Sale**: Sales and discount promotions
3. **Bonus**: Bonus and reward promotions

## 📝 Data Models

### Promotion Schema

```typescript
interface IPromotion {
  name: string                    // Promotion name
  userGroupName: string          // Target user group
  type: 'event' | 'sale' | 'bonus' // Promotion type
  startDate: Date               // Start date
  endDate: Date                 // End date
  isActive: boolean             // Active status
  isDeleted: boolean            // Soft deletion flag
  createdAt: Date
  updatedAt: Date
}
```

## 🔄 Business Logic

### Promotion Validation
- End date must be after start date
- Active promotions are automatically validated for current date
- Type must be one of: event, sale, bonus
- Soft deleted promotions are excluded from active queries

### Soft Deletion
- Promotions are soft deleted by default (isDeleted = true)
- Soft deleted promotions are excluded from normal queries
- Use `includeDeleted=true` query parameter to include deleted promotions
- Hard deletion is available for permanent removal

### Statistics
- Total promotions count (excluding deleted)
- Active, expired, and upcoming promotions
- Deleted promotions count
- Breakdown by promotion type (event, sale, bonus)

## 🛠️ Development

### Scripts

- `yarn start`: Build and start the server
- `yarn build`: Compile TypeScript
- `yarn watch`: Watch mode for development
- `yarn dev`: Development mode with hot reload

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

## 🔒 Security

- Environment variables for sensitive data
- Input validation and sanitization
- Error handling without exposing internals
- Graceful shutdown handling

## 📈 Monitoring

- Health check endpoint with database status
- Comprehensive logging
- Error tracking
- Performance monitoring ready

## 🚀 Deployment

1. Set `NODE_ENV=production`
2. Configure production database URL
3. Set appropriate environment variables
4. Build the application: `yarn build`
5. Start the server: `yarn start`

## 📚 Dependencies

- **Express**: Web framework
- **Mongoose**: MongoDB ODM
- **TypeScript**: Type safety
- **dotenv**: Environment variable management
- **nodemon**: Development server

## 🤝 Contributing

1. Follow the layered architecture pattern
2. Add proper error handling
3. Include TypeScript types
4. Update documentation
5. Test thoroughly
