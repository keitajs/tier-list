import logger from '../libs/logger.js'
import { hasEditPermission, hasMovePermission, hasAnyPermission } from './checkPermission.js'

// Az eredeti permission függvények router middlewarek, ezért át kell adni bizonyos adatokat, amiket ez a három változó helyettesít
const req = (userId, listId) => { return { id: userId, params: { id: listId } } }
const res = {
  status: () => { return { send: () => { return false } } },
  sendStatus: () => { return false }
}
const next = () => { return true }

// Lista
export const listEvents = (io, socket) => {
  socket.on('list-join', async (listId) => {
    if (socket.getListRoom()) return
    const roomName = `list-${listId}`
    
    const permission = await hasAnyPermission(req(socket.user.id, listId), res, next)
    if (!permission) return

    socket.join(roomName)
    
    const users = (await io.in(roomName).fetchSockets()).map(roomSocket => roomSocket.user).filter(user => user.id !== socket.user.id)
    socket.emit('user-join', users)
    socket.broadcast.to(roomName).emit('user-join', socket.user)

    logger.socket(`${socket.user.username} joined to room ${roomName}`)
  })

  socket.on('list-leave', async () => {
    const roomName = socket.getListRoom()
    if (!roomName) return

    socket.leave(roomName)
  })
}

const broadcastEditEvent = async (socket, event, data) => {
  const roomName = socket.getListRoom()
  if (!roomName) return

  const permission = await hasEditPermission(req(socket.user.id, socket.getListId()), res, next)
  if (!permission) return

  socket.broadcast.to(roomName).emit(event, data)
}

const broadcastMoveEvent = async (socket, event, data) => {
  const roomName = socket.getListRoom()
  if (!roomName) return

  const permission = await hasMovePermission(req(socket.user.id, socket.getListId()), res, next)
  if (!permission) return

  if (data.length === 2) return socket.broadcast.to(roomName).emit(event, data[0], data[1])
  socket.broadcast.to(roomName).emit(event, data[0], data[1], data[2])
}

// Karakter
export const characterEvents = (socket) => {
  socket.on('character-create', async (character) => broadcastEditEvent(socket, 'character-create', character))
  socket.on('character-update', async (character) => broadcastEditEvent(socket, 'character-update', character))
  socket.on('character-delete', async (characterId) => broadcastEditEvent(socket, 'character-delete', characterId))
  socket.on('character-move-start', async (characterId) => broadcastMoveEvent(socket, 'character-move-start', [ characterId, socket.user ]))
  socket.on('character-move-end', async (characterId, categoryId, position) => broadcastMoveEvent(socket, 'character-move-end', [ characterId, categoryId, position ]))
}

// Kategória
export const categoryEvents = (socket) => {
  socket.on('category-create', async (category) => broadcastEditEvent(socket, 'category-create', category))
  socket.on('category-update', async (category) => broadcastEditEvent(socket, 'category-update', category))
  socket.on('category-delete', async (categoryId) => broadcastEditEvent(socket, 'category-delete', categoryId))
  socket.on('category-move-start', async (categoryId) => broadcastMoveEvent(socket, 'category-move-start', [ categoryId, socket.user ]))
  socket.on('category-move-end', async (categoryId, position) => broadcastMoveEvent(socket, 'category-move-end', [ categoryId, position ]))
}