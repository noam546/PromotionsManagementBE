import mongoose from 'mongoose'
import config from '../config'

const DATABASE_URL = process.env.DATABASE_URL
export class DatabaseConnection {
  private static instance: DatabaseConnection
  private isConnected = false

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection()
    }
    return DatabaseConnection.instance
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Database already connected')
      return
    }

    try {
      // const mongoUri = `mongodb+srv://candidate:EchKvy7r7UCLvluf@operationscluster.64btjvn.mongodb.net/operations?retryWrites=true&w=majority`
      // const mongoUri = 'mongodb://localhost:27017/local'
      const mongoUri = DATABASE_URL
      console.log('DATABASE_URL',DATABASE_URL)
      await mongoose.connect(mongoUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      })

      this.isConnected = true
      console.log(`Connected to MongoDB: ${config.database.name}`)

      // Handle connection events
      mongoose.connection.on('error', (error) => {
        console.error('MongoDB connection error:', error)
        this.isConnected = false
      })

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected')
        this.isConnected = false
      })

      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected')
        this.isConnected = true
      })

    } catch (error) {
      console.error('Failed to connect to MongoDB:', error)
      throw error
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return
    }

    try {
      await mongoose.disconnect()
      this.isConnected = false
      console.log('Disconnected from MongoDB')
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error)
      throw error
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected
  }
}

export default DatabaseConnection.getInstance() 