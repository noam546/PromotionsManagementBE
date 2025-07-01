# Database Schema Migration Guide

This guide will help you update your MongoDB database to match your current Mongoose schema and resolve any type mismatches.

## 🔍 Step 1: Analyze Current Schema Issues

First, let's check what issues exist in your current database:

```bash
# Install ts-node if you haven't already
yarn add -D ts-node

# Check for schema mismatches
yarn check-schema
```

This will analyze your database and show you:
- Type mismatches (e.g., string fields that are numbers)
- Missing required fields
- Invalid enum values
- Date issues

## 🔧 Step 2: Run the Migration

If the analysis shows issues, run the migration script to fix them:

```bash
yarn migrate-schema
```

This script will:
- Convert field types to match your schema
- Map old enum values to new ones
- Fix invalid dates
- Ensure date logic is correct (end date after start date)

## 📋 Common Type Mismatch Scenarios

### 1. **Field Type Changes**
If you changed a field from `Number` to `String` (or vice versa):

**Before:**
```javascript
// Old schema
{
  promotionName: 12345  // Number
}
```

**After Migration:**
```javascript
// New schema
{
  promotionName: "12345"  // String
}
```

### 2. **Enum Value Updates**
If you changed the valid values for the `type` field:

**Before:**
```javascript
// Old enum values
{
  type: "discount"  // Old value
}
```

**After Migration:**
```javascript
// New enum values
{
  type: "sale"  // Mapped from "discount"
}
```

### 3. **Date Field Issues**
If date fields are stored as strings or invalid dates:

**Before:**
```javascript
// Invalid dates
{
  startDate: "2024-01-01",  // String instead of Date
  endDate: "invalid-date"   // Invalid date
}
```

**After Migration:**
```javascript
// Valid Date objects
{
  startDate: new Date("2024-01-01"),
  endDate: new Date("2024-01-02")  // Fixed invalid date
}
```

## 🛠️ Manual Migration Options

If you prefer to handle migrations manually, here are some MongoDB commands:

### Update Field Types
```javascript
// Convert promotionName from number to string
db.promotions.updateMany(
  { promotionName: { $type: "number" } },
  [{ $set: { promotionName: { $toString: "$promotionName" } } }]
)
```

### Update Enum Values
```javascript
// Map old enum values to new ones
db.promotions.updateMany(
  { type: "discount" },
  { $set: { type: "sale" } }
)

db.promotions.updateMany(
  { type: "reward" },
  { $set: { type: "bonus" } }
)
```

### Fix Date Fields
```javascript
// Convert string dates to Date objects
db.promotions.updateMany(
  { startDate: { $type: "string" } },
  [{ $set: { startDate: { $toDate: "$startDate" } } }]
)
```

## 🔄 Schema Validation

After migration, you can add schema validation to prevent future issues:

```javascript
// Add to your Promotion model
const PromotionSchema = new Schema({
  // ... your fields
}, {
  timestamps: true,
  collection: 'promotions',
  // Add strict validation
  strict: true,
  // Add custom validation
  validateBeforeSave: true
})
```

## 🚨 Important Notes

1. **Backup First**: Always backup your database before running migrations
2. **Test in Development**: Test migrations on a copy of your data first
3. **Monitor Logs**: Check the migration logs for any errors
4. **Verify Results**: Run the check script again after migration to verify fixes

## 🔍 Troubleshooting

### Migration Fails
- Check MongoDB connection
- Ensure you have write permissions
- Check for locked collections

### Type Errors Persist
- Restart your application after migration
- Clear any cached model instances
- Check if you have multiple model definitions

### Date Issues
- Ensure your timezone settings are correct
- Check for invalid date strings in your data
- Verify date format consistency

## 📞 Need Help?

If you encounter issues:
1. Run `yarn check-schema` to identify specific problems
2. Check the migration logs for error details
3. Verify your MongoDB connection and permissions
4. Ensure your Mongoose model is correctly defined

The migration scripts are designed to be safe and will only update documents that need changes. They won't affect documents that already match your schema. 