import express from 'express'
import cors from 'cors'
import cp from 'cookie-parser'
import router from './routes/router.js'
import logger from './libs/logger.js'
import './libs/associations.js'
import { createServer } from 'node:http'
import { createSocket } from './socket.js'
import { config } from 'dotenv'
config()

const app = express()
const port = process.env.PORT
const server = createServer(app)
createSocket(server)

app.use(cors({ credentials: true, origin: `http://localhost:3000` }))
app.use(express.json())
app.use(cp())
app.use('/', router)

server.listen(port, err => {
  if (err) throw logger.error(err)
  logger.server(`Running on http://localhost:${port}`)
})