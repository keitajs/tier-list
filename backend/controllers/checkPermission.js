import lists from '../models/list.js'
import permissions from '../models/permission.js'
import categories from '../models/category.js'
import characters from '../models/character.js'

export const isAdmin = async (req, res, next) => {
  try {
    const userId = req.id
    const listId = req.params.id

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
    const permission = await permissions.findOne({ where: { id: listId, userId } })
    if (!(list.userId === userId || (!list.private && level === 1) || (list.private && permission?.value >= level))) return res.status(403).send({ message: 'Nincs jogosultságod!' })
    
    next()
  } catch (err) {
    if (!err) return
    console.log(err)
    res.sendStatus(500)
  }
}

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