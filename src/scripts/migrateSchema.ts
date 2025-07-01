import mongoose from 'mongoose'
import Promotion from '../models/Promotion'
import databaseConnection from '../database/connection'

interface MigrationResult {
  totalDocuments: number
  updatedDocuments: number
  errors: string[]
}

async function migratePromotionSchema(): Promise<MigrationResult> {
  const result: MigrationResult = {
    totalDocuments: 0,
    updatedDocuments: 0,
    errors: []
  }

  try {
    console.log('🔍 Starting schema migration...')
    
    // Get all documents
    const allPromotions = await Promotion.find({})
    result.totalDocuments = allPromotions.length
    
    console.log(`📊 Found ${result.totalDocuments} documents to process`)

    for (const promotion of allPromotions) {
      try {
        let needsUpdate = false
        const updateData: any = {}

        // Check and fix field types
        if (typeof promotion.promotionName !== 'string') {
          updateData.promotionName = String(promotion.promotionName || '')
          needsUpdate = true
        }

        if (typeof promotion.userGroupName !== 'string') {
          updateData.userGroupName = String(promotion.userGroupName || '')
          needsUpdate = true
        }

        // Check and fix type enum values
        if (promotion.type && !['event', 'sale', 'bonus'].includes(promotion.type)) {
          // Map old values to new ones or set default
          const typeMapping: { [key: string]: string } = {
            'discount': 'sale',
            'reward': 'bonus',
            'campaign': 'event'
          }
          updateData.type = typeMapping[promotion.type] || 'event'
          needsUpdate = true
        }

        // Check and fix date fields
        if (!(promotion.startDate instanceof Date) || isNaN(promotion.startDate.getTime())) {
          updateData.startDate = new Date()
          needsUpdate = true
        }

        if (!(promotion.endDate instanceof Date) || isNaN(promotion.endDate.getTime())) {
          updateData.endDate = new Date(Date.now() + 24 * 60 * 60 * 1000) // Default to tomorrow
          needsUpdate = true
        }

        // Validate date logic
        if (promotion.startDate && promotion.endDate && promotion.startDate >= promotion.endDate) {
          updateData.endDate = new Date(promotion.startDate.getTime() + 24 * 60 * 60 * 1000)
          needsUpdate = true
        }

        // Apply updates if needed
        if (needsUpdate) {
          await Promotion.updateOne(
            { _id: promotion._id },
            { $set: updateData }
          )
          result.updatedDocuments++
          console.log(`✅ Updated document ${promotion._id}`)
        }

      } catch (error) {
        const errorMsg = `Error updating document ${promotion._id}: ${error instanceof Error ? error.message : 'Unknown error'}`
        result.errors.push(errorMsg)
        console.error(`❌ ${errorMsg}`)
      }
    }

    console.log(`🎉 Migration completed!`)
    console.log(`📈 Total documents: ${result.totalDocuments}`)
    console.log(`✅ Updated documents: ${result.updatedDocuments}`)
    console.log(`❌ Errors: ${result.errors.length}`)

    if (result.errors.length > 0) {
      console.log('\n❌ Errors encountered:')
      result.errors.forEach(error => console.log(`  - ${error}`))
    }

    return result

  } catch (error) {
    console.error('💥 Migration failed:', error)
    throw error
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  (async () => {
    try {
      await databaseConnection.connect()
      await migratePromotionSchema()
      await databaseConnection.disconnect()
      process.exit(0)
    } catch (error) {
      console.error('Migration failed:', error)
      process.exit(1)
    }
  })()
}

export default migratePromotionSchema 