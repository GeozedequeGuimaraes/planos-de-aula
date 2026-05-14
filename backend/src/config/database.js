import { PrismaClient } from '@prisma/client'
import logger from '../utils/logger.js'

const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
  ],
})

prisma.$on('error', (e) => {
  logger.error('Prisma error', { message: e.message, target: e.target })
})

export default prisma
