// Listához csatlakozás
export const onListJoin = socket => {
  socket.on('list-join', (listId) => {
    const roomName = `list-${listId}`
    
    socket.join(roomName)
    socket.broadcast.to(roomName).emit('user-join', socket.user)
  })
}

// Listából kilépés
export const onListLeave = socket => {
  socket.on('list-leave', () => {
    const roomName = Array.from(socket.rooms).filter(room => room != socket.id)[0]

    socket.leave(roomName)
    socket.broadcast.to(roomName).emit('user-leave', socket.user)
  })
}

// Karakter
// Létrehozás
export const onCharacterCreate = socket => {
  socket.on('character-create', () => {})
}

// Módosítás
export const onCharacterUpdate = socket => {
  socket.on('character-update', () => {})
}

// Törlés
export const onCharacterDelete = socket => {
  socket.on('character-delete', () => {})
}

// Mozgás kezdése
export const onCharacterMoveStart = socket => {
  socket.on('character-move-start', () => {})
}

// Mozgatás befejezése
export const onCharacterMoveEnd = socket => {
  socket.on('character-move-end', () => {})
}

// Kategória
// Létrehozás
export const onCategoryCreate = socket => {
  socket.on('category-create', () => {})
}

// Módosítás
export const onCategoryUpdate = socket => {
  socket.on('category-update', () => {})
}

// Törlés
export const onCategoryDelete = socket => {
  socket.on('category-delete', () => {})
}

// Mozgás kezdése
export const onCategoryMoveStart = socket => {
  socket.on('category-move-start', () => {})
}

// Mozgatás befejezése
export const onCategoryMoveEnd = socket => {
  socket.on('category-move-end', () => {})
}