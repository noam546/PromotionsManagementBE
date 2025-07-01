import Promotion from '../models/Promotion'
import databaseConnection from '../database/connection'

interface SchemaAnalysis {
  totalDocuments: number
  typeMismatches: Array<{
    documentId: string
    field: string
    expectedType: string
    actualValue: any
    actualType: string
  }>
  missingFields: Array<{
    documentId: string
    field: string
  }>
  invalidEnumValues: Array<{
    documentId: string
    field: string
    value: any
    validValues: string[]
  }>
  dateIssues: Array<{
    documentId: string
    field: string
    issue: string
    value: any
  }>
}

async function analyzeSchema(): Promise<SchemaAnalysis> {
  const analysis: SchemaAnalysis = {
    totalDocuments: 0,
    typeMismatches: [],
    missingFields: [],
    invalidEnumValues: [],
    dateIssues: []
  }

  try {
    console.log('🔍 Analyzing database schema...')
    
    // Get all documents
    const allPromotions = await Promotion.find({})
    analysis.totalDocuments = allPromotions.length
    
    console.log(`📊 Found ${analysis.totalDocuments} documents to analyze`)

    for (const promotion of allPromotions) {
      const docId = promotion._id.toString()

      // Check required fields
      const requiredFields = ['promotionName', 'userGroupName', 'type', 'startDate', 'endDate']
      for (const field of requiredFields) {
        if (!(field in promotion)) {
          analysis.missingFields.push({ documentId: docId, field })
        }
      }

      // Check field types
      if (promotion.promotionName !== undefined && typeof promotion.promotionName !== 'string') {
        analysis.typeMismatches.push({
          documentId: docId,
          field: 'promotionName',
          expectedType: 'string',
          actualValue: promotion.promotionName,
          actualType: typeof promotion.promotionName
        })
      }

      if (promotion.userGroupName !== undefined && typeof promotion.userGroupName !== 'string') {
        analysis.typeMismatches.push({
          documentId: docId,
          field: 'userGroupName',
          expectedType: 'string',
          actualValue: promotion.userGroupName,
          actualType: typeof promotion.userGroupName
        })
      }

      // Check enum values
      const validTypes = ['event', 'sale', 'bonus']
      if (promotion.type && !validTypes.includes(promotion.type)) {
        analysis.invalidEnumValues.push({
          documentId: docId,
          field: 'type',
          value: promotion.type,
          validValues: validTypes
        })
      }

      // Check date fields
      if (promotion.startDate && !(promotion.startDate instanceof Date)) {
        analysis.dateIssues.push({
          documentId: docId,
          field: 'startDate',
          issue: 'Not a Date object',
          value: promotion.startDate
        })
      } else if (promotion.startDate && isNaN(promotion.startDate.getTime())) {
        analysis.dateIssues.push({
          documentId: docId,
          field: 'startDate',
          issue: 'Invalid date',
          value: promotion.startDate
        })
      }

      if (promotion.endDate && !(promotion.endDate instanceof Date)) {
        analysis.dateIssues.push({
          documentId: docId,
          field: 'endDate',
          issue: 'Not a Date object',
          value: promotion.endDate
        })
      } else if (promotion.endDate && isNaN(promotion.endDate.getTime())) {
        analysis.dateIssues.push({
          documentId: docId,
          field: 'endDate',
          issue: 'Invalid date',
          value: promotion.endDate
        })
      }

      // Check date logic
      if (promotion.startDate && promotion.endDate && 
          promotion.startDate instanceof Date && promotion.endDate instanceof Date &&
          !isNaN(promotion.startDate.getTime()) && !isNaN(promotion.endDate.getTime()) &&
          promotion.startDate >= promotion.endDate) {
        analysis.dateIssues.push({
          documentId: docId,
          field: 'dateLogic',
          issue: 'End date is before or equal to start date',
          value: { startDate: promotion.startDate, endDate: promotion.endDate }
        })
      }
    }

    // Print analysis results
    console.log('\n Schema Analysis Results:')
    console.log(`Total documents: ${analysis.totalDocuments}`)
    console.log(`Type mismatches: ${analysis.typeMismatches.length}`)
    console.log(`Missing fields: ${analysis.missingFields.length}`)
    console.log(`Invalid enum values: ${analysis.invalidEnumValues.length}`)
    console.log(`Date issues: ${analysis.dateIssues.length}`)

    if (analysis.typeMismatches.length > 0) {
      console.log('\n Type Mismatches:')
      analysis.typeMismatches.forEach(mismatch => {
        console.log(`  - Document ${mismatch.documentId}: ${mismatch.field} should be ${mismatch.expectedType}, got ${mismatch.actualType} (${mismatch.actualValue})`)
      })
    }

    if (analysis.missingFields.length > 0) {
      console.log('\n Missing Fields:')
      analysis.missingFields.forEach(missing => {
        console.log(`  - Document ${missing.documentId}: missing ${missing.field}`)
      })
    }

    if (analysis.invalidEnumValues.length > 0) {
      console.log('\n Invalid Enum Values:')
      analysis.invalidEnumValues.forEach(invalid => {
        console.log(`  - Document ${invalid.documentId}: ${invalid.field} has invalid value "${invalid.value}", should be one of: ${invalid.validValues.join(', ')}`)
      })
    }

    if (analysis.dateIssues.length > 0) {
      console.log('\n Date Issues:')
      analysis.dateIssues.forEach(issue => {
        console.log(`  - Document ${issue.documentId}: ${issue.field} - ${issue.issue}`)
      })
    }

    if (analysis.typeMismatches.length === 0 && 
        analysis.missingFields.length === 0 && 
        analysis.invalidEnumValues.length === 0 && 
        analysis.dateIssues.length === 0) {
      console.log('\n No schema issues found! Your database is in sync with your Mongoose model.')
    } else {
      console.log('\n Run the migration script to fix these issues:')
      console.log('   yarn ts-node src/scripts/migrateSchema.ts')
    }

    return analysis

  } catch (error) {
    console.error('Schema analysis failed:', error)
    throw error
  }
}

// Run analysis if this script is executed directly
if (require.main === module) {
  (async () => {
    try {
      await databaseConnection.connect()
      await analyzeSchema()
      await databaseConnection.disconnect()
      process.exit(0)
    } catch (error) {
      console.error('Analysis failed:', error)
      process.exit(1)
    }
  })()
}

export default analyzeSchema 