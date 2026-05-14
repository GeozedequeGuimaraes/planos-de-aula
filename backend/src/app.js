import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import routes from './routes/index.js'
import { errorHandler } from './middlewares/errorHandler.js'
import logger from './utils/logger.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api', routes)
app.use(errorHandler)

app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`)
})

export default app
