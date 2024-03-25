// Lista
export const listEvents = (io, socket) => {
  socket.on('list-join', (listId) => {
    if (socket.getListRoom()) return
    const roomName = `list-${listId}`
    
    console.log(socket.user.username + ' joined room ' + roomName)
    socket.join(roomName)
    socket.broadcast.to(roomName).emit('user-join', socket.user)
  })

  socket.on('list-leave', () => {
    const roomName = socket.getListRoom()
    if (!roomName) return

    socket.leave(roomName)
    socket.broadcast.to(roomName).emit('user-leave', socket.user)
  })
}

// Karakter
export const characterEvents = (io, socket) => {
  socket.on('character-create', () => {})
  socket.on('character-update', () => {})
  socket.on('character-delete', (characterId) => {})

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