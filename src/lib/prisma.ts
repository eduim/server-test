import { PrismaClient } from '@prisma/client'
import Logger from './logger'

const prisma = new PrismaClient()

process.on('SIGINT', async () => {
  Logger.log('Disconnect from database')
  await prisma.$disconnect()
})

export default prisma
