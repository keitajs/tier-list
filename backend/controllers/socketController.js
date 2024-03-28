import logger from '../libs/logger.js'

// Lista
export const listEvents = (io, socket) => {
  socket.on('list-join', async (listId) => {
    if (socket.getListRoom()) return
    const roomName = `list-${listId}`
    
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

// Karakter
export const characterEvents = (io, socket) => {
  socket.on('character-create', (character) => {
    const roomName = socket.getListRoom()
    if (!roomName) return

    socket.broadcast.to(roomName).emit('character-create', character)
  })

  socket.on('character-update', (character) => {
    const roomName = socket.getListRoom()
    if (!roomName) return

    socket.broadcast.to(roomName).emit('character-update', character)
  })
  
  socket.on('character-delete', (characterId) => {
    const roomName = socket.getListRoom()
    if (!roomName) return

    socket.broadcast.to(roomName).emit('character-delete', characterId)
  })

  socket.on('character-move-start', (characterId) => {
    const roomName = socket.getListRoom()
    if (!roomName) return

    socket.broadcast.to(roomName).emit('character-move-start', characterId, socket.user)
  })

  socket.on('character-move-end', (characterId, categoryId, position) => {
    const roomName = socket.getListRoom()
    if (!roomName) return

    socket.broadcast.to(roomName).emit('character-move-end', characterId, categoryId, position)
  })
}

// Kategória
export const categoryEvents = (io, socket) => {
  socket.on('category-create', (category) => {
    const roomName = socket.getListRoom()
    if (!roomName) return

    socket.broadcast.to(roomName).emit('category-create', category)
  })

  socket.on('category-update', (category) => {
    const roomName = socket.getListRoom()
    if (!roomName) return
  
    socket.broadcast.to(roomName).emit('category-update', category)
  })

  socket.on('category-delete', (categoryId) => {
    const roomName = socket.getListRoom()
    if (!roomName) return

    socket.broadcast.to(roomName).emit('category-delete', categoryId)
  })

  socket.on('category-move-start', (categoryId) => {
    const roomName = socket.getListRoom()
    if (!roomName) return

    socket.broadcast.to(roomName).emit('category-move-start', categoryId, socket.user)
  })

  socket.on('category-move-end', (categoryId, position) => {
    const roomName = socket.getListRoom()
    if (!roomName) return

    socket.broadcast.to(roomName).emit('category-move-end', categoryId, position)
  })
}