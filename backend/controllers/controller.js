import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import rndstr from 'rndstr'
import logger from '../libs/logger.js'
import users from '../models/user.js'
import lists from '../models/list.js'
import permissions from '../models/permission.js'
import categories from '../models/category.js'
import characters from '../models/character.js'
import animes from '../models/anime.js'
import updates from '../models/update.js'
import moment from 'moment'
import path from 'path'
import fs from 'fs'
import { Op, fn, col } from 'sequelize'
import { Errors } from '../libs/errors.js'
import { sendMail } from '../libs/resend.js'

const updateActivity = async (userId, listId) => {
  try {
    // A felhasználó mai napi lista updateját megkeresi, ha nincs létrehozza, ha van frissíti a countot és a timeot
    const update = await updates.findOne({ where: { date: new Date(), userId, listId } })
    if (!update) await updates.create({ count: 1, date: new Date(), time: new Date(), userId, listId })
    else {
      update.count += 1
      update.time = new Date()
      await update.save()
    }

    return true
  } catch (err) {
    if (!err) return
    logger.error(err)
    return err
  }
}

export const getAvatarImage = async (req, res) => {
  // Felhasználó profilképek lekérése
  const filePath = `${path.resolve()}/images/avatars/${req.params.filename}`
  if (!fs.existsSync(filePath)) res.status(404).send({ message: 'Nem található kép!' })

  res.sendFile(filePath)
}

export const getCharacterImage = async (req, res) => {
  // Karakter képek lekérése
  const filePath = `${path.resolve()}/images/characters/${req.params.filename}`
  if (!fs.existsSync(filePath)) res.status(404).send({ message: 'Nem található kép!' })

  res.sendFile(`${path.resolve()}/images/characters/${req.params.filename}`)
}

export const Register = async (req, res) => {
  try {
    const { username, email, password } = req.body
    const errors = new Errors()

    // Adatok ellenőrzése
    errors.empty({ username, email, password }, 'Üres mező!')
    errors.email({ email }, 'Nem megfelelő formátum!')
    errors.password({ password }, 'A jelszavadnak legalább 8 karakter hosszúnak kell lenni!')
    
    if (!errors.get('username')) {
      const nameCheck = await users.findOne({ where: { username } })
      if (nameCheck) errors.push('username', 'A megadott felhasználónév már foglalt!')
    }
    
    if (!errors.get('email')) {
      const emailCheck = await users.findOne({ where: { email } })
      if (emailCheck) errors.push('email', 'A megadott email cím már foglalt!')
    }
    
    // Ha vannak hibás adatok, akkor visszaküldi a felhasználónak
    if (errors.check) return res.status(400).send({ errors: errors.get() })

    // Jelszó titkosítás, email verify token és felhasználó létrehozás
    const hashedPassword = await bcrypt.hash(password, 10)
    const verifyToken = rndstr({ length: 54 }) + Date.now().toString().slice(0, 10)
    await users.create({ username, email, password: hashedPassword, verifyToken })

    // Email küldése
    await sendMail(email, 'Sikeres regisztráció', 'libs/resend_templates/verifyEmail.html', { username, title: 'Sikeres regisztráció!', link: `http://localhost:3000/email-verification?token=${verifyToken}` })
    res.send({ message: 'Sikeres regisztráció!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const Login = async (req, res) => {
  try {
    const { username, password } = req.body
    const errors = new Errors()

    // Adatok ellenőrzése
    errors.empty({ username, password }, 'Üres mező!')
    if (errors.check) return res.status(400).send({ errors: errors.get() })

    const user = await users.findOne({ where: { username }, attributes: [ 'id', 'username', 'email', 'password' ] })
    if (!user) errors.push('username', 'A felhasználó nem található!')
    if (errors.check) return res.status(400).send({ errors: errors.get() })

    const passMatch = await bcrypt.compare(password, user.password)
    if (!passMatch) errors.push('password', 'Hibás jelszó!')
    if (errors.check) return res.status(400).send({ errors: errors.get() })

    // accessToken létrehozás
    const accessToken = jwt.sign({ id: user.id, username }, process.env.ACCESS_SECRET, { expiresIn: '7d' })
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
    res.sendStatus(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const updateUsername = async (req, res) => {
  try {
    const { username } = req.body
    const errors = new Errors()

    errors.empty({ username }, 'Üres mező!')
    if (errors.check) return res.status(400).send({ errors: errors.get() })

    // Ellenőrzi, hogy az új felhasználónévvel már van-e felhasználó
    const checkUsername = await users.findOne({ where: { username } })
    if (checkUsername) errors.push('username', 'A megadott felhasználónév már foglalt!')
    if (errors.check) return res.status(400).send({ errors: errors.get() })
    
    await users.update({ username }, { where: { id: req.id } })

    // Új accessToken, ezáltal nem lesz kijelentkezve
    const accessToken = jwt.sign({ id: req.id, username }, process.env.ACCESS_SECRET, { expiresIn: '7d' })
    res.cookie('accessToken', accessToken, { maxAge: 7*24*60*60*1000, httpOnly: true, sameSite: 'None', secure: true })
    res.send({ message: 'Sikeres felhasználónév módosítás!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.sendStatus(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const updateAvatar = async (req, res) => {
  try {
    const avatar = req.file
    const errors = new Errors()

    if (!avatar) errors.push('avatar', 'Tölts fel egy képet!')
    if (errors.check) return res.status(400).send({ errors: errors.get() })

    await users.update({ avatar: avatar.filename }, { where: { id: req.id } })
    res.send({ message: 'Sikeres profilkép módosítás!', file: avatar.filename })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.sendStatus(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const deleteAvatar = async (req, res) => {
  try {
    await users.update({ avatar: 'dummy.png' }, { where: { id: req.id } })
    res.send({ message: 'Sikeres profilkép törlés!', file: 'dummy.png' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.sendStatus(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const updateEmail = async (req, res) => {
  try {
    const { email, password } = req.body
    const errors = new Errors()
    
    errors.empty({ email, password }, 'Üres mező!')
    if (errors.check) return res.status(400).send({ errors: errors.get() })

    // Jelszó ellenőrzés
    const user = await users.findOne({ where: { id: req.id }, attributes: [ 'username', 'password' ] })
    const passMatch = await bcrypt.compare(password, user.password)
    if (!passMatch) errors.push('password', 'Hibás jelszó!')
    
    // Ellenőrzi, hogy az új e-mail címmel már van-e felhasználó
    const checkEmail = await users.findOne({ where: { email } })
    if (checkEmail) errors.push('email', 'A megadott email cím már foglalt!')

    if (errors.check) return res.status(400).send({ errors: errors.get() })
    
    // Új email verification token generálás és felhasználó update
    const verifyToken = rndstr({ length: 54 }) + Date.now().toString().slice(0, 10)
    await users.update({ email, verifyToken }, { where: { id: req.id } })

    // Email küldése
    await sendMail(email, 'Sikeres email módosítás', 'libs/resend_templates/verifyEmail.html', { username: user.username, title: 'Email módosítás', link: `http://localhost:3000/email-verification?token=${verifyToken}` })
    res.send({ message: 'Sikeres email módosítás!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.sendStatus(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const updatePassword = async (req, res) => {
  try {
    const { password, currentPassword } = req.body
    const errors = new Errors()

    errors.empty({ password, currentPassword }, 'Üres mező!')
    if (errors.check) return res.status(400).send({ errors: errors.get() })

    // Jelenlegi jelszó ellenőrzés
    const user = await users.findOne({ where: { id: req.id }, attributes: [ 'password' ] })
    const passMatch = await bcrypt.compare(currentPassword, user.password)
    if (!passMatch) errors.push('currentPassword', 'Hibás jelszó!')

    // Új jelszó ellenőrzés
    errors.password({ password }, 'Túl rövid!')
    if (errors.check) return res.status(400).send({ errors: errors.get() })

    const hashedPassword = await bcrypt.hash(password, 10)
    await users.update({ password: hashedPassword }, { where: { id: req.id } })

    res.send({ message: 'Sikeres jelszó módosítás!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.sendStatus(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body
    
    const user = await users.findOne({ where: { id: req.id } })
    if (!user.verifyToken) return res.status(400).send({ message: 'Az email címed már hitelesítve van!' })
    if (user.verifyToken !== token) return res.status(400).send({ message: 'Az email címed hitelesítése ezen linken keresztül nem hitelesíthető!' })

    user.verifyToken = null
    user.save()

    res.send({ message: 'Sikeresen hitelesítetted az email címedet!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.sendStatus(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const getUserData = async (req, res) => {
  try {
    const { user: username } = req.query

    const user = await users.findOne({ where: username ? { username } : { id: req.id }, attributes: ['id', 'username', 'email', 'avatar', 'status', 'registerDate'] })
    if (username) user.email = 'hiddenmail@tl.hu'

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

    res.send({
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
    })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.sendStatus(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const getUserList = async (req, res) => {
  try {
    const { id } = req.params

    // Lekéri a listát a kategóriákkal és karakterekkel
    const list = await lists.findOne({
      where: { id },
      include: {
        model: categories, required: false,
        include: {
          model: characters, required: false,
          include: { model: animes, required: false }
        }
      },
      order: [
        [categories, 'position', 'asc'],
        [categories, characters, 'position', 'asc']
      ]
    })

    // Lekéri a hozzá tartozó permissiont (ha nincs jogosultság és eljutott idáig, akkor valószínűleg egy publikus listát tekint meg -> permission.value = 1 | ha a felhasználó listája akkor null)
    const permission = await permissions.findOne({ where: { userId: req.id, listId: id } })
    res.send({ list, permission: !permission && list.userId !== req.id ? { value: 1 } : permission })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const getUserLists = async (req, res) => {
  try {
    const results = await lists.findAll({
      where: {
        userId: req.id
      },
      include: {
        model: permissions,
        required: false,
        include: {
          model: users,
          required: true,
          attributes: ['id', 'username', 'avatar']
        }
      }
    })

    res.send(results)
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const getSidebarLists = async (req, res) => {
  try {
    // Sidebar-ra lekéri az utoljára frissített 10 listát
    const results = await lists.findAll({
      where: {
        userId: req.id
      },
      include: {
        model: updates,
        separate: true,
        order: [
          ['date', 'desc'],
          ['time', 'desc']
        ],
        limit: 1,
        include: {
          model: users,
          attributes: ['id', 'username', 'avatar']
        }
      }
    })

    const orderedResults = results.sort((a, b) => new Date(b.updates[0].date + 'T' + b.updates[0].time + 'Z') - new Date(a.updates[0].date + 'T' + a.updates[0].time + 'Z'))
    const limitedResults = orderedResults.slice(0, 10)

    res.send(limitedResults)
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const getSharedLists = async (req, res) => {
  try {
    // Megosztott / listák amikhez jogosultságot kapott
    const results = await lists.findAll({
      include: [
        {
          model: permissions,
          where: {
            userId: req.id
          }
        },
        {
          model: updates,
          separate: true,
          order: [
            ['date', 'desc'],
            ['time', 'desc']
          ],
          limit: 1,
          include: {
            model: users,
            attributes: ['id', 'username', 'avatar']
          }
        }
      ]
    })

    res.send(results)
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const getPublicLists = async (req, res) => {
  try {
    // Kereséskor kap egy query-t
    const { q: query } = req.query

    // Publikus listák + az utolsó módosítás
    const results = await lists.findAll({
      where: {
        name: { [Op.like]: query ? `%${query}%` : '%' },
        private: false
      },
      include: {
        model: updates,
        separate: true,
        order: [
          ['date', 'desc'],
          ['time', 'desc']
        ],
        limit: 1,
        include: {
          model: users,
          attributes: ['id', 'username', 'avatar']
        }
      },
      order: query ? [] : [ fn('RAND') ],
      limit: 10
    })

    res.send(results)
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const createList = async (req, res) => {
  try {
    const { name, description, status, visible } = req.body
    const list = await lists.create({ name, description, status, private: !visible, userId: req.id })

    // Alapértelmezett kategóriák hozzáadása
    await categories.bulkCreate([
      { name: 'A', position: 1, color: '#880000', listId: list.id },
      { name: 'B', position: 2, color: '#888800', listId: list.id },
      { name: 'C', position: 3, color: '#008800', listId: list.id },
      { listId: list.id }
    ])

    await updateActivity(req.id, list.id)
    res.send(list)
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const updateList = async (req, res) => {
  try {
    const { id: listId } = req.params
    const { name, description, status, visible } = req.body
    await lists.update({ name, description, status, private: !visible }, { where: { id: listId, userId: req.id } })

    await updateActivity(req.id, listId)
    res.send({ message: 'Sikeresen módosítottad a listát!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const removeList = async (req, res) => {
  try {
    await lists.destroy({ where: { id: req.params.id, userId: req.id } })
    res.send({ message: 'Sikeresen törölted a listát!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const createPermission = async (req, res) => {
  try {
    const { id: listId } = req.params
    const { username, permission } = req.body
    if (username === req.username) return res.status(400).send({ message: 'Saját magadnak nem adhatsz jogosultságot!' })

    // Ellenőrzi, hogy az adott felhasználónév létezik-e
    const user = await users.findOne({ where: { username }, attributes: ['id', 'username', 'avatar'] })
    if (!user) return res.status(400).send({ message: 'Nem található felhasználó!' })

    // Ellenőrzi, hogy kapott-e már jogosultságot
    const checkPermission = await permissions.findOne({ where: { userId: user.id, listId }})
    if (checkPermission) return res.status(400).send({ message: 'A felhasználó már rendelkezik jogosultsággal!' })

    const result = await permissions.create({ value: permission, userId: user.id, listId })

    await updateActivity(req.id, listId)
    res.send({ ...result.dataValues, user })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const updatePermission = async (req, res) => {
  try {
    const { id: listId, userId } = req.params
    const { value } = req.body

    await permissions.update({ value }, { where: { userId, listId } })
    
    await updateActivity(req.id, listId)
    res.send({ message: 'Sikeresen módosítottad a jogosultságot!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const removePermission = async (req, res) => {
  try {
    const { id: listId, userId } = req.params
    await permissions.destroy({ where: { userId, listId } })

    await updateActivity(req.id, listId)
    res.send({ message: 'Sikeresen törölted a jogosultságot!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const createCategory = async (req, res) => {
  try {
    const { id: listId } = req.params
    const { name, color } = req.body

    // Lekéri az utolsó kategória pozícióját -> az a pozíció + 1 lesz az új kategória helye
    const position = (await categories.findAndCountAll({ where: { listId, position: { [Op.not]: null } } })).count + 1
    const result = await categories.create({ name, position, color, listId })

    await updateActivity(req.id, listId)
    res.send(result)
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const moveCategory = async (req, res) => {
  try {
    const { id: listId, categoryId } = req.params
    const { position } = req.body

    // Lekéri a kategóriát és ellenőrzi, hogy létezik-e
    const category = await categories.findOne({ where: { id: categoryId, listId } })
    if (!category) return res.status(400).send({ message: 'Nem található kategória!' })

    // Ha ugyan oda szeretné letenni, ahol jelenleg is van, akkor visszaküldi
    if (position === category.position) return res.sendStatus(200)

    // Növeli / csökkenti a kategória pozíciókat az alapján hol lesz az új helye (ennek a logikája a documents/tervezés/code/karakter-áthelyezés.png-ben látható)
    if (position < category.position) await categories.increment({ position: 1 }, { where: { listId, position: { [Op.between]: [position, category.position - 1] } } })
    else await categories.increment({ position: -1 }, { where: { listId, position: { [Op.between]: [category.position + 1, position] } } })

    await categories.update({ position }, { where: { id: categoryId } })

    await updateActivity(req.id, listId)
    res.send({ message: 'Sikeresen áthelyezted a kategóriát!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const updateCategory = async (req, res) => {
  try {
    const { id: listId, categoryId } = req.params
    const { name, color } = req.body

    await categories.update({ name, color }, { where: { id: categoryId, listId } })

    await updateActivity(req.id, listId)
    res.send({ message: 'Sikeresen módosítottad a kategóriát!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const removeCategory = async (req, res) => {
  try {
    const { id: listId, categoryId } = req.params
    await categories.destroy({ where: { id: categoryId, listId } })

    await updateActivity(req.id, listId)
    res.send({ message: 'Sikeresen törölted a kategóriát!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const createCharacter = async (req, res) => {
  try {
    const { id: listId } = req.params
    const { name, url: characterUrl } = JSON.parse(req.body.character)
    const { title, url: animeUrl } = JSON.parse(req.body.anime)
    const image = req.file || req.body.image

    // Lekéri a lista egyetlen pozíció nélküli kategóriáját, a karakter pozícióját, az animét (ha van), majd a kapott adatokkal létrehozza a karaktert
    // Az 'image' lehet URL vagy lementett kép, ezért az alapján mit kapott lementi azt
    const category = await categories.findOne({ where: { position: null, listId } })
    const position = (await characters.findAndCountAll({ where: { categoryId: category.id } })).count + 1
    const anime = title ? await animes.findOrCreate({ where: { title, url: animeUrl } }) : [ { id: null } ]
    const character = await characters.create({ name, position, url: characterUrl, image: image?.filename || image, categoryId: category.id, animeId: anime[0].id })
    const result = await characters.findOne({ where: { id: character.id }, include: { model: animes, required: false } })

    await updateActivity(req.id, listId)
    res.send(result)
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const moveCharacter = async (req, res) => {
  try {
    const { id: listId, characterId } = req.params
    const { position, categoryId } = req.body

    // Lekéri a kategóriát és karaktert, hogy meglegyenek az eredeti adatok
    const category = await categories.findOne({ where: { id: categoryId, listId } })
    if (!category) return res.status(400).send({ message: 'Nem található kategória!' })

    const character = await characters.findOne({ where: { id: characterId } })
    if (!character) return res.status(400).send({ message: 'Nem található karakter!' })

    // Növeli / csökkenti a karakterek pozícióját az alapján hol lesz az új helye (ennek a logikája a documents/tervezés/code/karakter-áthelyezés.png-ben látható)
    if (character.categoryId === category.id) {
      if (position === character.position) return res.sendStatus(200)

      if (position < character.position) await characters.increment({ position: 1 }, { where: { categoryId: category.id, position: { [Op.between]: [position, character.position - 1] } } })
      else await characters.increment({ position: -1 }, { where: { categoryId: category.id, position: { [Op.between]: [character.position + 1, position] } } })
    } else {
      await characters.increment({ position: -1 }, { where: { categoryId: character.categoryId, position: { [Op.gt]: character.position } } })
      await characters.increment({ position: 1 }, { where: { categoryId, position: { [Op.gte]: position } } })
    }

    await characters.update({ position, categoryId }, { where: { id: characterId } })

    await updateActivity(req.id, listId)
    res.send({ message: 'Sikeresen áthelyezted a karaktert!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const updateCharacter = async (req, res) => {
  try {
    const { id: listId, characterId } = req.params
    const { name, url: characterUrl } = JSON.parse(req.body.character)
    const { title, url: animeUrl } = JSON.parse(req.body.anime)
    const image = req.file || req.body.image

    // Az 'image' lehet URL vagy lementett kép, ezért az alapján mit kapott lementi azt
    const anime = title ? await animes.findOrCreate({ where: { title, url: animeUrl } }) : [ { id: null } ]
    await characters.update({ name, url: characterUrl, image: image?.filename || image, animeId: anime[0].id }, { where: { id: characterId } })

    await updateActivity(req.id, listId)
    res.send({ message: 'Sikeresen módosítottad a karaktert!', image: image?.filename || image, anime: anime[0] })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const removeCharacter = async (req, res) => {
  try {
    const { id: listId, characterId } = req.params
    await characters.destroy({ where: { id: characterId } })

    await updateActivity(req.id, listId)
    res.send({ message: 'Sikeresen törölted a karaktert!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}