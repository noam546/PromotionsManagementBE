import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

export interface Config {
  port: number
  nodeEnv: string

  database: {
    url: string
    name: string
  }
}

const config: Config = {
  port: parseInt(process.env.PORT || '8000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017',
    name: process.env.DATABASE_NAME || 'promotions_db',
  },

}

// Validation function
export function validateConfig(): void {
  const requiredEnvVars = [
    // Add any required environment variables here
    // 'DATABASE_URL',
    // 'JWT_SECRET',
  ]
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }
}

export default config 