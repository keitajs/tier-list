// Lista
export const listEvents = (io, socket) => {
  socket.on('list-join', async (listId) => {
    if (socket.getListRoom()) return
    const roomName = `list-${listId}`
    
    socket.join(roomName)

    const users = (await io.in(roomName).fetchSockets()).map(roomSocket => { return { socketId: roomSocket.id, ...roomSocket.user } }).filter(user => user.socketId !== socket.id)
    socket.emit('user-join', users)
    socket.broadcast.to(roomName).emit('user-join', socket.user)
  })

  socket.on('list-leave', async () => {
    const roomName = socket.getListRoom()
    if (!roomName) return

    socket.leave(roomName)
    socket.broadcast.to(roomName).emit('user-leave', socket.id)
  })

  io.of("/").adapter.on('leave-room', async (room, id) => {
    if (!room.startsWith('list')) return
    socket.broadcast.to(room).emit('user-leave', id)
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
  socket.on('category-create', () => {})
  socket.on('category-update', () => {})
  socket.on('category-delete', () => {})
  socket.on('category-move-start', () => {})
  socket.on('category-move-end', () => {})
}