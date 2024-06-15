import cp from 'cookie-parser'
import users from './models/user.js'
import logger from './libs/logger.js'
import { Server } from 'socket.io'
import { listEvents, characterEvents, categoryEvents } from './controllers/socket-controller.js'
import { verifyTokenSocket } from './controllers/verifyToken.js'

export const createSocket = (server) => {
  // Socket IO szerver
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    },
    cookie: true
  })

  // Socket IO cookie kezelés és token ellenőrzés
  const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)
  io.use(wrap(cp()))
  io.use(verifyTokenSocket)

  // Socket IO
  io.on("connection", socket => {
    logger.socket(`User connected :: ${socket.user.username} # ${socket.user.id}`)

    listEvents(io, socket)
    characterEvents(socket)
    categoryEvents(socket)

    socket.on('disconnect', () => {
      logger.socket(`User disconnected :: ${socket.user.username} # ${socket.user.id}`)

      // 5 másodperc után ellenőrzi, hogy a felhasználó jelen van-e mint socket, ha nem akkor átállítja az adatbázisban is
      setTimeout(() => {
        let isOnline = false
        io.of('/').sockets.forEach(_socket => {
          if (socket.user.id === _socket.user.id && socket.user.username === _socket.user.username)
            isOnline = true
        })

        if (!isOnline)
          users.update({ status: 0 }, { where: { id: socket.user.id, username: socket.user.username } })
      }, 5000)
    })
  })

  io.of("/").adapter.on('leave-room', async (room, id) => {
    if (!room.startsWith('list')) return
    const user = io.of('/').sockets.get(id).user

    io.to(room).emit('user-leave', user.id)
    logger.socket(`${user.username} left from room ${room}`)
  })
}