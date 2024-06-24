import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import rndstr from 'rndstr'
import logger from '../libs/logger.js'
import users from '../models/user.js'
import emails from '../models/emails.js'
import lists from '../models/list.js'
import categories from '../models/category.js'
import characters from '../models/character.js'
import animes from '../models/anime.js'
import updates from '../models/update.js'
import moment from 'moment'
import path from 'path'
import fs from 'fs'
import { unlink } from 'fs/promises'
import { Op, fn, col } from 'sequelize'
import { Errors } from '../libs/errors.js'
import { sendMail } from '../libs/resend.js'

export const getAvatarImage = async (req, res) => {
  // Felhasználó profilképek lekérése
  let filePath = `${path.resolve()}/images/avatars/${req.params.filename}`
  if (!fs.existsSync(filePath)) filePath = `${path.resolve()}/images/avatars/dummy.png`

  res.sendFile(filePath)
}

export const registerEmail = async (req, res) => {
  try {
    // Email cím regisztrálása és hitelesítés megkezdése
    const { email } = req.body
    const errors = new Errors()

    // Formai követelmények
    errors.empty({ email }, 'Üres mező!')
    errors.email({ email }, 'Nem megfelelő formátum!')
    if (errors.check) return res.send({ errors: errors.get() })

    // Ellenőrzés, hogy az email cím már foglalt-e
    const checkEmail = await emails.findOne({ where: { address: email } })
    if (checkEmail) {
      const user = await users.findOne({ where: { emailId: checkEmail.id } })
      if (user) return res.send({ errors: { email: 'A megadott email cím már foglalt!' } })
      if (!moment().isAfter(moment(checkEmail.expDate).subtract(process.env.MAILCODE_MINS - 1, 'minutes'))) return res.send({ errors: { email: 'Percenként csak egy hitelesítő kódot kérhetsz!' } })
    }

    // Hitelesítő kód és lejárati idő
    const code = rndstr({ length: 6, chars: 'A-Z0-9', parseRange: true })
    const expDate = moment().add(process.env.MAILCODE_MINS, 'minutes').toDate()

    // Email kód adatok frissítése
    if (!checkEmail) await emails.create({ address: email, code, expDate })
    else {
      checkEmail.code = code
      checkEmail.expDate = expDate
      await checkEmail.save()
    }

    // Hitelesítő email kiküldése
    await sendMail(email, 'Email hitelesítés', 'libs/resend_templates/verifyEmail.html', { title: 'Email hitelesítés', code })
    res.send({ message: 'Email hitelesítő kód sikeresen elküldve!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ errors: { email: 'Ismeretlen hiba történt!' } })
  }
}

export const verifyEmail = async (req, res) => {
  try {
    // Email hitelesítés
    const { email, code } = req.body
    
    const checkEmail = await emails.findOne({ where: { address: email } })
    if (checkEmail.code === null) return res.send({ errors: { code: 'Az email címhez nem tartozik kód!' } })
    if (checkEmail.code !== code) return res.send({ errors: { code: 'Az email címhez nem ez a kód tartozik!' } })
    if (moment().isAfter(checkEmail.expDate)) return res.send({ errrors: { code: 'Az email címhez tartozó kód lejárt!' } })
    
    checkEmail.code = null
    await checkEmail.save()

    const registerToken = jwt.sign({ address: email }, process.env.REGISTER_SECRET, { expiresIn: '15m' })
    res.cookie('registerToken', registerToken, { maxAge: 15*60*1000, httpOnly: true, sameSite: 'None', secure: true })
    res.send({ message: 'Sikeresen hitelesítetted az email címedet!', emailId: checkEmail.id })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ errors: { code: 'Ismeretlen hiba történt!' } })
  }
}

export const Register = async (req, res) => {
  try {
    const { username, password } = req.body
    const errors = new Errors()

    // Adatok ellenőrzése
    errors.empty({ username, password }, 'Üres mező!')
    errors.username({ username }, 'Nem megfelelő formátum!')
    errors.password({ password }, 'A jelszavadnak legalább 8 karakter hosszúnak kell lenni!')
    
    if (!errors.get('username')) {
      const nameCheck = await users.findOne({ where: { username } })
      if (nameCheck) errors.push('username', 'A megadott felhasználónév már foglalt!')
    }
    if (errors.check) return res.send({ errors: errors.get() })

    // Regisztrációs token lekérése
    const token = req.cookies.registerToken
    if (!token) return res.send({ errors: { username: 'Regisztrációs token nem található!' } })

    // Tokenből email address kinyerése
    let address = ''
    jwt.verify(token, process.env.REGISTER_SECRET, (err, decoded) => {
      if (err) res.send({ errors: { username: ["Hiba történt a token feldolgozása közben!"] } })
      address = decoded.address
    })
    if (!address) return res.send({ errors: { username: 'Regisztrációs email nem található!' } })

    // Email ellenőrzések
    const email = await emails.findOne({ where: { address } })
    if (!email) return res.send({ errors: { username: 'Az email cím nem található!' } })
    if (email.code) return res.send({ errors: { username: 'Az email cím nincs hitelesítve!' } })
    if (moment().isAfter(email.expDate)) return res.send({ errrors: { username: 'Az email cím regisztrációs ideje lejárt!' } })
    
    // Ellenőrzés, hogy nem-e lett regisztrálva az email címmel
    const user = await users.findOne({ where: { emailId: email.id } })
    if (user) return res.send({ errors: { username: 'A megadott email cím már foglalt!' } })

    const hashedPassword = await bcrypt.hash(password, 10)
    await users.create({ username, password: hashedPassword, emailId: email.id })

    res.clearCookie('registerToken', { sameSite: 'None', secure: true })
    res.send({ message: 'Sikeres regisztráció!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ errors: { username: 'Ismeretlen hiba történt!' } })
  }
}

export const Login = async (req, res) => {
  try {
    const { username, password } = req.body
    const errors = new Errors()

    // Adatok ellenőrzése
    errors.empty({ username, password }, 'Üres mező!')
    if (errors.check) return res.send({ errors: errors.get() })

    const user = await users.findOne({
      attributes: ['id', 'username', 'password'],
      include: {
        model: emails,
        attributes: ['address'],
        required: false
      },
      where: {
        [Op.or]: [
          { username },
          { '$email.address$': username }
        ]
      }
    })
    if (!user) errors.push('username', 'A felhasználó nem található!')
    if (errors.check) return res.send({ errors: errors.get() })

    const passMatch = await bcrypt.compare(password, user.password)
    if (!passMatch) errors.push('password', 'Hibás jelszó!')
    if (errors.check) return res.send({ errors: errors.get() })

    // accessToken létrehozás
    const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.ACCESS_SECRET, { expiresIn: '7d' })
    user.accessToken = accessToken
    await user.save()

    res.cookie('accessToken', accessToken, { maxAge: 7*24*60*60*1000, httpOnly: true, sameSite: 'None', secure: true })
    res.send({ message: 'Sikeres bejelentkezés!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const Logout = async (req, res) => {
  try {
    // accessToken-t törli a sütikből
    const accessToken = req.cookies.accessToken
    if (!accessToken) return res.status(400).send({ message: 'Nem vagy bejelentkezve!' })

    await users.update({ accessToken: null }, { where: { accessToken } })

    res.clearCookie('accessToken', { sameSite: 'None', secure: true })
    return res.send({ message: 'Sikeres kijelentkezés!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const Logged = async (req, res) => {
  try {
    // Visszaadja, hogy a felhasználó be van-e jelentkezve
    const token = req.cookies.accessToken
    if (!token) return res.send(false)

    jwt.verify(token, process.env.ACCESS_SECRET, async (err, decoded) => {
      if (err) return res.send(false)
      const { id, username } = decoded
      
      // Felhasználó létezésének ellenőrzése
      const user = await users.findOne({ where: { id: id, username: username } })
      if (!user) return res.send(false)
      if (user.accessToken !== token) return res.send(false)

      res.send(true)
    })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const updateUsername = async (req, res) => {
  try {
    const { username } = req.body
    const errors = new Errors()

    errors.empty({ username }, 'Üres mező!')
    errors.username({ username }, 'Nem megfelelő formátum!')
    if (errors.check) return res.send({ errors: errors.get() })

    // Ellenőrzi, hogy az új felhasználónévvel már van-e felhasználó
    const checkUsername = await users.findOne({ where: { username } })
    if (checkUsername) errors.push('username', 'A megadott felhasználónév már foglalt!')
    if (errors.check) return res.send({ errors: errors.get() })
    
    // Új accessToken és felhasználónév módosítás
    const accessToken = jwt.sign({ id: req.id, username }, process.env.ACCESS_SECRET, { expiresIn: '7d' })
    await users.update({ username, accessToken }, { where: { id: req.id } })

    res.cookie('accessToken', accessToken, { maxAge: 7*24*60*60*1000, httpOnly: true, sameSite: 'None', secure: true })
    res.send({ message: 'Sikeres felhasználónév módosítás!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ errors: { username: 'Ismeretlen hiba történt!' } })
  }
}

export const updateAvatar = async (req, res) => {
  try {
    // Profilkép feltöltés
    const avatar = req.file
    const errors = new Errors()

    if (!avatar) errors.push('avatar', 'Tölts fel egy képet!')
    if (errors.check) return res.send({ errors: errors.get() })

    const user = await users.findOne({ where: { id: req.id } })
    const oldAvatar = path.resolve() + '/images/avatars/' + user.avatar
    if (fs.existsSync(oldAvatar) && user.avatar !== 'dummy.png') await unlink(oldAvatar)
    user.avatar = avatar.filename
    user.save()

    res.send({ message: 'Sikeres profilkép módosítás!', file: avatar.filename })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ errors: { avatar: 'Ismeretlen hiba történt!' } })
  }
}

export const deleteAvatar = async (req, res) => {
  try {
    // Profilkép törlés
    const user = await users.findOne({ where: { id: req.id } })
    const oldAvatar = path.resolve() + '/images/avatars/' + user.avatar
    if (fs.existsSync(oldAvatar) && user.avatar !== 'dummy.png') await unlink(oldAvatar)
    user.avatar = 'dummy.png'
    user.save()

    res.send({ message: 'Sikeres profilkép törlés!', file: 'dummy.png' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ errors: { avatar: 'Ismeretlen hiba történt!' } })
  }
}

export const updateEmail = async (req, res) => {
  try {
    const errors = new Errors()
    
    // Módosításhoz szükséges "regisztrációs" token lekérése
    const token = req.cookies.registerToken
    if (!token) return res.send({ errors: { email: 'Hitelesítő token nem található!' } })

    // Tokenből email address kinyerése
    let address = ''
    jwt.verify(token, process.env.REGISTER_SECRET, (err, decoded) => {
      if (err) res.send({ errors: { email: ["Hiba történt a token feldolgozása közben!"] } })
      address = decoded.address
    })
    if (!address) return res.send({ errors: { email: 'Hitelesített email nem található!' } })

    // Email ellenőrzések
    const email = await emails.findOne({ where: { address } })
    if (!email) errors.push('email', 'Az email cím nem található!')
    if (email.code) errors.push('email', 'Az email cím nincs hitelesítve!')

    if (errors.check) return res.status(400).send({ errors: errors.get() })
    
    // Ellenőrzés, hogy nem-e lett regisztrálva az email címmel
    const checkUser = await users.findOne({ where: { emailId: email.id } })
    if (checkUser) return res.send({ errors: { email: 'A megadott email cím már foglalt!' } })

    // Email cím módosítása
    await users.update({ emailId: email.id }, { where: { id: req.id } })

    res.clearCookie('registerToken', { sameSite: 'None', secure: true })
    res.send({ message: 'Sikeres email módosítás!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ errors: { email: 'Ismeretlen hiba történt!' } })
  }
}

export const updatePassword = async (req, res) => {
  try {
    const { password, currentPassword } = req.body
    const errors = new Errors()

    errors.empty({ password, currentPassword }, 'Üres mező!')
    if (errors.check) return res.send({ errors: errors.get() })

    // Jelenlegi jelszó ellenőrzés
    const user = await users.findOne({ where: { id: req.id }, attributes: [ 'password' ] })
    const passMatch = await bcrypt.compare(currentPassword, user.password)
    if (!passMatch) errors.push('currentPassword', 'Hibás jelszó!')

    // Új jelszó ellenőrzés
    errors.password({ password }, 'Túl rövid!')
    if (errors.check) return res.send({ errors: errors.get() })

    const hashedPassword = await bcrypt.hash(password, 10)
    await users.update({ password: hashedPassword }, { where: { id: req.id } })

    res.send({ message: 'Sikeres jelszó módosítás!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ errors: { password: 'Ismeretlen hiba történt!' } })
  }
}

const getUserProfileData = async (_user) => {
  try {
    const { id, username } = _user

    const user = await users.findOne({ where: username ? { username } : { id }, attributes: ['id', 'username', 'avatar', 'status', 'registerDate', 'emailId'] })
    if (!user) return { error: 'A keresett felhasználó nem található!' }

    const email = await emails.findOne({ where: { id: user.emailId } })
    user.dataValues.email = email && !username ? email.address : 'hiddenmail@tl.hu'

    // A felhasználó heti aktivitása
    const activities = await updates.findAll({ where: { userId: user.id, date: { [Op.gte]: moment().subtract(7, 'days').toDate() } }, include: { model: lists, attributes: ['name'] }})
    const weeklyActivies = []
    for (let i = 6; i >= 0; i--) {
      const date = moment().subtract(i, 'days')
      const days = activities.filter(x => moment(x.date).toDate().toDateString() == date.toDate().toDateString())
      const lists = days.reduce((a, b) => [ ...a, { name: b.list.name, count: b.count } ], [])

      weeklyActivies.push({
        day: date.locale('hu').format('dddd'),
        count: days.reduce((a, b) => a + b.count, 0),
        lists
      })
    }

    // Felhasználó összes listája, kategóriája és karakterje
    const userLists = await lists.findAll({
      where: { userId: user.id },
      include: { model: categories, include: { model: characters, include: { model: animes } } }
    })
    const userCategories = [].concat(...userLists.map(x => x.categories))
    const userCharacters = [].concat(...userCategories.map(x => x.characters))

    // Kikeresi a legtöbbet használt karaktereket, az alapján hogy név és animeId vagy az url megegyezik
    const mostUsedCharacters = userCharacters.reduce((array, item) => {
      const character = array.find(x => (x.name === item.name && x.animeId === item.animeId) || x.url === item.url)
      if (character) character.count++
      else array.push({ ...item.dataValues, count: 1 })
      return array
    }, []).sort((a, b) => b.count - a.count).slice(0, 10)

    // Legtöbbet frissített listák
    const mostUpdatedLists = await lists.findAll({
      where: { userId: user.id },
      attributes: [
        'id', 'name', 'private',
        [fn('SUM', col('count')), 'totalUpdates']
      ],
      include: {
        model: updates,
        attributes: []
      },
      group: ['id'],
      order: [['totalUpdates', 'DESC']],
      subQuery: false,
      limit: 10
    })

    return {
      user,
      weeklyActivies,
      list: {
        count: userLists.length,
        0: userLists.filter(x => x.status === 1).length,
        1: userLists.filter(x => x.status === 2).length,
        2: userLists.filter(x => x.status === 3).length,
        categories: {
          count: userCategories.filter(x => x.name).length
        },
        characters: {
          count: userCharacters.length,
          mostUsed: mostUsedCharacters
        },
        mostUpdated: mostUpdatedLists
      }
    }
  } catch (error) {
    return { error }
  }
}

export const getUserData = async (req, res) => {
  const data = await getUserProfileData({ id: req.id })
  if (data.error) return res.send({ error: data.error })

  res.send(data)
}

export const getUserDataByUsername = async (req, res) => {
  const data = await getUserProfileData({ username: req.params.username })
  if (data.error) return res.send({ error: data.error })

  res.send(data)
}