import jwt from 'jsonwebtoken'
import users from '../models/user.js'

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken
    if (!token) return res.status(401).send({ message: 'Nem található token!' })

    jwt.verify(token, process.env.ACCESS_SECRET, async (err, decoded) => {
      if (err) return res.status(403).send({ message: 'Hiba történt a token feldolgozása közben!' })
      const { id, username } = decoded
      
      // Felhasználó létezésének ellenőrzése
      const user = await users.findOne({ where: { id, username } })
      if (!user) return res.status(403).send({ message: 'Nem található felhasználó!' })
      if (user.accessToken !== token) return res.status(403).send({ message: 'Hibás token!' })
      
      // Főbb adatok átadása a későbbi adatlekérésekhez
      req.id = id
      req.username = username      
      next()
    })
  } catch (err) {
    if (!err) return
    console.log(err)
    res.sendStatus(500)
  }
}

export const refreshToken = async (req, res) => {
  try {
    // Új accessToken létrehozás
    const accessToken = jwt.sign({ id: req.id, username: req.username }, process.env.ACCESS_SECRET, { expiresIn: '7d' })
    await users.update({ accessToken }, { where: { id: req.id, username: req.username } })
    
    res.cookie('accessToken', accessToken, { maxAge: 7*24*60*60*1000, httpOnly: true, sameSite: 'None', secure: true })
    res.status(200).send({ message: 'Token frissítve.' })
  } catch (error) {
    if (!err) return
    console.log(err)
    res.sendStatus(500)
  }
}

export const verifyTokenSocket = async (socket, next) => {
  try {
    const token = socket.request.cookies.accessToken
    if (!token) return socket.disconnect()

    jwt.verify(token, process.env.ACCESS_SECRET, async (err, decoded) => {
      if (err) return socket.disconnect()
      const { id, username } = decoded
      
      // Felhasználó létezésének ellenőrzése
      const user = await users.findOne({ where: { id: id, username: username } })
      if (!user) return socket.disconnect()
      if (user.accessToken !== token) return socket.disconnect()

      // Felhasználó online
      user.status = 1
      await user.save()

      // Felhasználó adatait megkapja a socket
      socket.user = { id, username }
      socket.getListRoom = () => { return Array.from(socket.rooms).find(room => room.startsWith('list')) }
      socket.getListId = () => {
        const roomName = socket.getListRoom()
        return roomName ? Number(roomName.split('-')[1]) : undefined
      }
      next()
    })
  } catch (error) {
    if (!err) return
    console.log(err)
    socket.disconnect()
  }
}