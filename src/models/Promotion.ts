import mongoose, { Document, Schema } from 'mongoose'

export interface IPromotion extends Document {
  promotionName: string
  userGroupName: string
  type: 'event' | 'sale' | 'bonus'
  startDate: Date
  endDate: Date
  isActive: boolean
  isDeleted: boolean
}

const PromotionSchema = new Schema<IPromotion>({
  promotionName: {
    type: String,
    required: [true, 'Promotion name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  userGroupName: {
    type: String,
    required: [true, 'User group name is required'],
    trim: true,
    maxlength: [100, 'User group name cannot exceed 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Promotion type is required'],
    enum: {
      values: ['event', 'sale', 'bonus'],
      message: 'Type must be event, sale, or bonus'
    }
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'promotions'
})

// Indexes for better query performance
PromotionSchema.index({ isActive: 1, isDeleted: 1, startDate: 1, endDate: 1 })
PromotionSchema.index({ type: 1, isDeleted: 1 })
PromotionSchema.index({ userGroupName: 1, isDeleted: 1 })
PromotionSchema.index({ createdAt: -1, isDeleted: 1 })
PromotionSchema.index({ isDeleted: 1 }) // General soft delete index

// Pre-save middleware to validate dates
PromotionSchema.pre('save', function(next) {
  if (this.startDate >= this.endDate) {
    next(new Error('End date must be after start date'))
  }
  next()
})

export default mongoose.model<IPromotion>('Promotion', PromotionSchema) 