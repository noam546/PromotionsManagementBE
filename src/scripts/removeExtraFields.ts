import mongoose from 'mongoose'
import Promotion from '../models/Promotion'
import databaseConnection from '../database/connection'

async function removeExtraFields() {
  try {
    await databaseConnection.connect()
    console.log('🔍 Removing extra fields (isActive, isDeleted) from promotions...')
    const result = await Promotion.updateMany(
      {},
      { $unset: { isActive: "", isDeleted: "" } }
    )
    console.log(`✅ Removed fields from ${result.modifiedCount} documents.`)
    await databaseConnection.disconnect()
    process.exit(0)
  } catch (error) {
    console.error('❌ Failed to remove extra fields:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  removeExtraFields()
}

export default removeExtraFields 