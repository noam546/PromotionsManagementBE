import mongoose, { Document, Schema } from 'mongoose'

export interface IPromotion extends Document {
  promotionName: string
  userGroupName: string
  type: 'basic' | 'epic' | 'common'
  startDate: Date
  endDate: Date
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
      values: ['basic', 'epic', 'common'],
      message: 'Type must be basic, epic, or common'
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
}, {
  timestamps: true,
  collection: 'promotions'
})

PromotionSchema.index({ type: 1, userGroupName: 1, createdAt: -1 })
PromotionSchema.index({ promotionName: 'text', userGroupName: 'text' })
PromotionSchema.index({ startDate: 1 })
PromotionSchema.index({ endDate: 1 })

PromotionSchema.pre('save', function(next) {
  if (this.startDate >= this.endDate) {
    next(new Error('End date must be after start date'))
  }
  next()
})

export default mongoose.model<IPromotion>('Promotion', PromotionSchema) 