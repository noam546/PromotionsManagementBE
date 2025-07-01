import * as express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import promotionRoutes from './routes/promotionRoutes'
import { errorHandler, notFound } from './middleware/errorHandler'
import config, { validateConfig } from './config'
import databaseConnection from './database/connection'

const cors = require('cors')

// Validate configuration on startup
validateConfig()

const app: express.Application = express()
const server = createServer(app)

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Your React app URL
    methods: ["GET", "POST"]
  }
})

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Welcome to Express & TypeScript Server')
})

app.get('/health', (req: express.Request, res: express.Response) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: databaseConnection.getConnectionStatus() ? 'connected' : 'disconnected',
        websocket: 'enabled'
    })
})

app.use('/api/promotions', promotionRoutes)

app.use(notFound)
app.use(errorHandler)

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`)
    
    socket.on('join_promotions_room', () => {
        socket.join('promotions')
        console.log(`Client ${socket.id} joined promotions room`)
    })
    
    socket.on('leave_promotions_room', () => {
        socket.leave('promotions')
        console.log(`Client ${socket.id} left promotions room`)
    })
    
    socket.on('disconnect', (reason) => {
        console.log(`Client disconnected: ${socket.id}, reason: ${reason}`)
    })
})

// Helper function to emit WebSocket events
export const emitPromotionEvent = (eventType: string, data: any) => {
    io.to('promotions').emit(eventType, {
        ...data,
        timestamp: new Date().toISOString()
    })
}

// Connect to database and start server
async function startServer() {
    try {
        // Connect to MongoDB
        await databaseConnection.connect()
        
        // Start the server (use server.listen instead of app.listen)
        server.listen(config.port, () => {
            console.log(`Server is Running at http://localhost:${config.port}`)
            console.log(`WebSocket server enabled`)
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