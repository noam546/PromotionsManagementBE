import * as express from 'express'
import * as dotenv from 'dotenv'
import promotionRoutes from './routes/promotionRoutes'
import { errorHandler, notFound } from './middleware/errorHandler'

dotenv.config()

const app: express.Application = express()
const port = process.env.PORT || 8000;

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Basic route
app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Welcome to Express & TypeScript Server')
})

// Health check endpoint
app.get('/health', (req: express.Request, res: express.Response) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/promotions', promotionRoutes)

// Error handling middleware (must be last)
app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server is Running at http://localhost:${port}`)
})