import * as express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import {PromotionRoutes} from './routes'
import { errorHandler, notFound } from './middleware'
import config from './config'
import {DatabaseConnection} from './database'
const cors = require('cors')

const app: express.Application = express()
const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: config.reactAppUrl, 
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
        database: DatabaseConnection.getConnectionStatus() ? 'connected' : 'disconnected',
        websocket: 'enabled'
    })
})

app.use('/api/promotions', PromotionRoutes)

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

export const emitPromotionEvent = (eventType: string, data: any) => {
    io.to('promotions').emit(eventType, {
        ...data,
        timestamp: new Date().toISOString()
    })
}

async function startServer() {
    try {

        
        await DatabaseConnection.connect()
        
        server.listen(config.port, () => {
            console.log(`Server is Running at http://localhost:${config.port}`)
        })

        process.on('SIGTERM', async () => {
            server.close(async () => {
                await DatabaseConnection.disconnect()
                console.log('Server closed')
                process.exit(0)
            })
        })

        process.on('SIGINT', async () => {
            server.close(async () => {
                await DatabaseConnection.disconnect()
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