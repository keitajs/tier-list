// Lista
export const listEvents = (io, socket) => {
  socket.on('list-join', (listId) => {
    const roomName = `list-${listId}`
    
    socket.join(roomName)
    socket.broadcast.to(roomName).emit('user-join', socket.user)
  })

  socket.on('list-leave', () => {
    const roomName = Array.from(socket.rooms).filter(room => room != socket.id)[0]

    socket.leave(roomName)
    socket.broadcast.to(roomName).emit('user-leave', socket.user)
  })
}

// Karakter
export const characterEvents = (io, socket) => {
  socket.on('character-create', () => {})
  socket.on('character-update', () => {})
  socket.on('character-delete', () => {})
  socket.on('character-move-start', () => {})
  socket.on('character-move-end', () => {})
}

// Kategória
export const categoryEvents = (io, socket) => {
  socket.on('category-create', () => {})
  socket.on('category-update', () => {})
  socket.on('category-delete', () => {})
  socket.on('category-move-start', () => {})
  socket.on('category-move-end', () => {})
}