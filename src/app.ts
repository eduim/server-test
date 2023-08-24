import express, { Express } from 'express'
import { Server } from 'http'
import cors from 'cors'

import Logger from './lib/logger'
import errorHandler from './middlewares/error-handler'

import { PORT } from './lib/constants'
import { router, authRouter } from './router'

const app: Express = express()
const port = PORT || 8080

app.use(cors())
app.use(express.json())

app.use(router)
app.use(authRouter)

app.use(errorHandler)
function startServer(): Server {
  const server = app.listen(port, () => {
    Logger.info(`[server]: Server is running at http://localhost:${port}`)
  })

  process.on('SIGTERM', () => {
    server.close()
  })
  return server
}

export default startServer
