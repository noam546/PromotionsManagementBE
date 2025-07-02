import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

// Prefer .env.local if it exists, otherwise fallback to .env
const envLocalPath = path.resolve(process.cwd(), '.env.local')
const envPath = path.resolve(process.cwd(), '.env')

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath })
} else {
  dotenv.config({ path: envPath })
}

export interface Config {
  port: number
  nodeEnv: string
  reactAppUrl: string

  database: {
    url: string
  }
}

const config: Config = {
  port: parseInt(process.env.PORT || '8000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  reactAppUrl: process.env.REACT_APP_URL || 'http://localhost:3000',
  
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017',
  },
}



export default config 