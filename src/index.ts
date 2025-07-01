import * as express from 'express'
import promotionRoutes from './routes/promotionRoutes'
import { errorHandler, notFound } from './middleware/errorHandler'
import config, { validateConfig } from './config'
import databaseConnection from './database/connection'

// Validate configuration on startup
validateConfig()

const app: express.Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Welcome to Express & TypeScript Server')
})

app.get('/health', (req: express.Request, res: express.Response) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: databaseConnection.getConnectionStatus() ? 'connected' : 'disconnected'
    })
})

app.use('/api/promotions', promotionRoutes)

app.use(notFound)
app.use(errorHandler)

// Connect to database and start server
async function startServer() {
    try {
        // Connect to MongoDB
        await databaseConnection.connect()
        
        // Start the server
        const server = app.listen(config.port, () => {
            console.log(`Server is Running at http://localhost:${config.port}`)
            console.log(`Environment: ${config.nodeEnv}`)
            console.log(`Database: ${config.database.name}`)
        })

        // Graceful shutdown
        process.on('SIGTERM', async () => {
            console.log('SIGTERM received, shutting down gracefully...')
            server.close(async () => {
                await databaseConnection.disconnect()
                console.log('Server closed')
                process.exit(0)
            })
        })

        process.on('SIGINT', async () => {
            console.log('SIGINT received, shutting down gracefully...')
            server.close(async () => {
                await databaseConnection.disconnect()
                console.log('Server closed')
                process.exit(0)
            })
        })

    } catch (error) {
        console.error('Failed to start server:', error)
        process.exit(1)
    }
}

startServer()