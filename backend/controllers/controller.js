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
import { Op } from 'sequelize'
import { Errors } from '../libs/errors.js'

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

    // Jelszó titkosítás, felhasználó létrehozás
    const hashedPassword = await bcrypt.hash(password, 10)
    await users.create({ username, email, password: hashedPassword, verifyToken: rndstr({ length: 54 }) + Date.now().toString().slice(0, 10) })

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

    res.clearCookie('accessToken')
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

      res.send(true)
    })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.sendStatus(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const getUserList = async(req, res) => {
  try {
    const { id } = req.params

    const result = await lists.findOne({
      where: { id },
      include: {
        model: categories,  required: false,
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
    res.send(result)
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const getUserLists = async (req, res) => {
  try {
    const results = await lists.findAll({ where: { userId: req.id }, include: { model: permissions, required: false, include: { model: users, required: true, attributes: ['id', 'username', 'avatar'] } } })
    res.send(results)
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const getSharedLists = async (req, res) => {
  try {
    const results = await lists.findAll({ include: { model: permissions, where: { userId: req.id } } })
    return res.send(results)
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const getPublicLists = async (req, res) => {
  try {
    const results = await lists.findAll({ where: { private: false } })
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
    await categories.bulkCreate([
      { name: 'A', position: 1, color: '#880000', listId: list.id },
      { name: 'B', position: 2, color: '#888800', listId: list.id },
      { name: 'C', position: 3, color: '#008800', listId: list.id },
      { listId: list.id }
    ])

    res.send(list)
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const updateList = async (req, res) => {
  try {
    const { name, description, status, visible } = req.body
    await lists.update({ name, description, status, private: !visible }, { where: { id: req.params.id, userId: req.id } })
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
    const { username, permission } = req.body
    if (username === req.username) return res.status(400).send({ message: 'Saját magadnak nem adhatsz jogosultságot!' })

    const user = await users.findOne({ where: { username }, attributes: ['id', 'username', 'avatar'] })
    if (!user) return res.status(400).send({ message: 'Nem található felhasználó!' })

    const checkPermission = await permissions.findOne({ where: { userId: user.id, listId: req.params.id }})
    if (checkPermission) return res.status(400).send({ message: 'A felhasználó már rendelkezik jogosultsággal!' })

    const result = await permissions.create({ value: permission, userId: user.id, listId: req.params.id })
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

    const position = (await categories.findAndCountAll({ where: { listId, position: { [Op.not]: null } } })).count + 1
    const result = await categories.create({ name, position, color, listId })

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

    const category = await categories.findOne({ where: { id: categoryId, listId } })
    if (!category) return res.status(400).send({ message: 'Nem található kategória!' })

    if (position === category.position) return res.sendStatus(200)

    if (position < category.position) await categories.increment({ position: 1 }, { where: { listId, position: { [Op.between]: [position, category.position - 1] } } })
    else await categories.increment({ position: -1 }, { where: { listId, position: { [Op.between]: [category.position + 1, position] } } })

    await categories.update({ position }, { where: { id: categoryId } })
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
    const { name, url: characterUrl, image } = req.body.character
    const { title, url: animeUrl } = req.body.anime

    const category = await categories.findOne({ where: { position: null, listId } })
    const position = (await characters.findAndCountAll({ where: { categoryId: category.id } })).count + 1
    const anime = await animes.findOrCreate({ where: { title, url: animeUrl } })
    const character = await characters.create({ name, position, url: characterUrl, image, categoryId: category.id, animeId: anime[0].id })
    const result = await characters.findOne({ where: { id: character.id }, include: { model: animes, required: false } })

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

    const category = await categories.findOne({ where: { id: categoryId, listId } })
    if (!category) return res.status(400).send({ message: 'Nem található kategória!' })

    const character = await characters.findOne({ where: { id: characterId } })
    if (!character) return res.status(400).send({ message: 'Nem található karakter!' })

    if (character.categoryId === category.id) {
      if (position === character.position) return res.sendStatus(200)

      if (position < character.position) await characters.increment({ position: 1 }, { where: { categoryId: category.id, position: { [Op.between]: [position, character.position - 1] } } })
      else await characters.increment({ position: -1 }, { where: { categoryId: category.id, position: { [Op.between]: [character.position + 1, position] } } })
    } else {
      await characters.increment({ position: -1 }, { where: { categoryId: character.categoryId, position: { [Op.gt]: character.position } } })
      await characters.increment({ position: 1 }, { where: { categoryId, position: { [Op.gte]: position } } })
    }

    await characters.update({ position, categoryId }, { where: { id: characterId } })
    res.send({ message: 'Sikeresen áthelyezted a karaktert!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const updateCharacter = async (req, res) => {
  try {
    const { characterId } = req.params
    const { name, url, image } = req.body

    await characters.update({ name, url, image }, { where: { id: characterId } })
    res.send({ message: 'Sikeresen módosítottad a karaktert!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}

export const removeCharacter = async (req, res) => {
  try {
    const { characterId } = req.params
    await characters.destroy({ where: { id: characterId } })
    res.send({ message: 'Sikeresen törölted a karaktert!' })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: err, message: 'Ismeretlen hiba történt!' })
  }
}