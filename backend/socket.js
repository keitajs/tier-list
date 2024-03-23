import cp from 'cookie-parser'
import users from './models/user.js'
import logger from './libs/logger.js'
import { Server } from 'socket.io'
import { onListJoin, onListLeave, onCharacterCreate, onCharacterUpdate, onCharacterDelete, onCharacterMoveStart, onCharacterMoveEnd, onCategoryCreate, onCategoryUpdate, onCategoryDelete, onCategoryMoveStart, onCategoryMoveEnd } from './controllers/socketController.js'
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

    onListJoin(socket)
    onListLeave(socket)
    onCharacterCreate(socket)
    onCharacterUpdate(socket)
    onCharacterDelete(socket)
    onCharacterMoveStart(socket)
    onCharacterMoveEnd(socket)
    onCategoryCreate(socket)
    onCategoryUpdate(socket)
    onCategoryDelete(socket)
    onCategoryMoveStart(socket)
    onCategoryMoveEnd(socket)

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
}