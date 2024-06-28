import logger from '../libs/logger.js'
import users from '../models/user.js'
import lists from '../models/list.js'
import permissions from '../models/permission.js'
import categories from '../models/category.js'
import characters from '../models/character.js'
import { updateActivity } from './list-controller.js'

export const createPermission = async (req, res) => {
  try {
    const { id: listId } = req.params
    const { username, permission } = req.body
    if (username === req.username) return res.send({ error: 'Saját magadnak nem adhatsz jogosultságot!' })

    // Ellenőrzi, hogy az adott felhasználónév létezik-e
    const user = await users.findOne({ where: { username }, attributes: ['id', 'username', 'avatar'] })
    if (!user) return res.send({ error: 'Nem található felhasználó!' })

    // Ellenőrzi, hogy kapott-e már jogosultságot
    const checkPermission = await permissions.findOne({ where: { userId: user.id, listId }})
    if (checkPermission) return res.send({ error: 'A felhasználó már rendelkezik jogosultsággal!' })

    const result = await permissions.create({ value: permission, userId: user.id, listId })

    await updateActivity(req.id, listId)
    res.send({ ...result.dataValues, user })
  } catch (err) {
    if (!err) return
    logger.error(err)
    res.status(500).send({ error: 'Ismeretlen hiba történt!' })
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
    res.status(500).send({ error: 'Ismeretlen hiba történt!' })
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
    res.status(500).send({ error: 'Ismeretlen hiba történt!' })
  }
}

export const isAdmin = async (req, res, next) => {
  try {
    const userId = req.id
    const listId = req.params.id

    // Csak akkor lehet admin egy listához, ha az a saját listája
    const list = await lists.findOne({ where: { id: listId, userId } })
    if (!list) return res.status(403).send({ message: 'Ehhez a művelethez nincs jogosultságod!' })

    next()
  } catch (err) {
    if (!err) return
    console.log(err)
    res.sendStatus(500)
  }
}

export const hasEditPermission = async (req, res, next) => await hasMinLevel(req, res, next, 3)
export const hasMovePermission = async (req, res, next) => await hasMinLevel(req, res, next, 2)
export const hasAnyPermission = async (req, res, next) => await hasMinLevel(req, res, next, 1)

const hasMinLevel = async (req, res, next, level) => {
  try {
    const userId = req.id
    const listId = req.params.id

    const list = await lists.findOne({ where: { id: listId } })
    const permission = await permissions.findOne({ where: { listId, userId } })

    // Ellenőrzi, hogy megadott szintű jogosultsággal rendelkezik-e a felhasználó
    if (!list || !(list.userId === userId || (!list.private && level === 1) || (permission?.value >= level))) return res.status(403).send({ message: 'Nincs jogosultságod!' })
    
    return next()
  } catch (err) {
    if (!err) return
    console.log(err)
    res.sendStatus(500)
  }
}

// Ha kap paraméterként egy kategóriát vagy karaktert, akkor ellenőrzi, hogy az benne van-e az adott listában
export const isInList = async (req, res, next) => {
  const { id: listId, categoryId, characterId } = req.params
  
  if (categoryId) {
    const category = await categories.findOne({ where: { id: categoryId, listId } })
    if (!category) return res.status(400).send({ message: 'Nem található kategória ehhez a listához!' })
  }

  if (characterId) {
    const character = await characters.findOne({ where: { id: characterId } })
    if (!character) return res.status(400).send({ message: 'Nem található karakter!' })

    const category = await categories.findOne({ where: { id: character.categoryId, listId } })
    if (!category) return res.status(400).send({ message: 'Nem található karakter ehhez a listához!' })
  }

  next()
}