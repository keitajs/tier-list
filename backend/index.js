import express from 'express'
import cors from 'cors'
import cp from 'cookie-parser'
import router from './routes/router.js'
import logger from './libs/logger.js'
import './libs/associations.js'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { verifyTokenSocket } from './controllers/verifyToken.js'
import { config } from 'dotenv'
config()

const app = express()
const port = process.env.PORT

// Socket IO szerver
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
  cookie: true
})

app.use(cors({ credentials: true, origin: `http://localhost:3000` }))
app.use(express.json())
app.use(cp())
app.use('/', router)

// Socket IO cookie kezelés és token ellenőrzés
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)
io.use(wrap(cp()))
io.use(verifyTokenSocket)

// Socket IO
io.on("connection", socket => {
  logger.socket(`Socket connected :: ${socket.user.username} # ${socket.user.id}`)

  socket.on('disconnect', () => {
    logger.socket(`Socket disconnected :: ${socket.user.username} # ${socket.user.id}`)
  })
})

server.listen(port, err => {
  if (err) throw logger.error(err)
  logger.server(`Running on http://localhost:${port}`)
})