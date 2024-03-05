import jwt from 'jsonwebtoken'
import users from '../models/user.js'

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken
    if (!token) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_SECRET, async (err, decoded) => {
      if (err) return res.sendStatus(403)
      const { id, username } = decoded
      
      // Felhasználó létezésének ellenőrzése
      const user = await users.findOne({ where: { id: id, username: username } })
      if (!user) return res.sendStatus(403)

      // Főbb adatok átadása a későbbi adatlekérésekhez
      req.id = id
      req.username = username
      
      // Új accessToken létrehozás
      const accessToken = jwt.sign({ id, username }, process.env.ACCESS_SECRET, { expiresIn: '7d' })
      res.cookie('accessToken', accessToken, { maxAge: 7*24*60*60*1000, httpOnly: true, sameSite: 'None', secure: true })
      next()
    })
  } catch (err) {
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
      if (err) return res.sendStatus(403)
      const { id, username } = decoded
      
      // Felhasználó létezésének ellenőrzése
      const user = await users.findOne({ where: { id: id, username: username } })
      if (!user) return res.sendStatus(403)

      // Felhasználó adatait megkapja a socket
      socket.user = { id, username }
      next()
    })
  } catch (error) {
    if (!err) return
    console.log(err)
    res.sendStatus(500)
  }
}