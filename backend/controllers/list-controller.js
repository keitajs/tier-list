import logger from '../libs/logger.js'
import users from '../models/user.js'
import lists from '../models/list.js'
import permissions from '../models/permission.js'
import categories from '../models/category.js'
import characters from '../models/character.js'
import animes from '../models/anime.js'
import updates from '../models/update.js'
import { Op, fn } from 'sequelize'

export const updateActivity = async (userId, listId) => {
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
    const { q: query } = req.query

    // Felhasználó összes listája
    const results = await lists.findAll({
      where: {
        userId: req.id,
        name: { [Op.like]: query ? `%${query}%` : '%' }
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
    const { q: query } = req.query

    // Megosztott / listák amikhez jogosultságot kapott
    const results = await lists.findAll({
      where: {
        name: { [Op.like]: query ? `%${query}%` : '%' }
      },
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
      { name: 'D', position: 4, color: '#008888', listId: list.id },
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
    // Lista adatok módosítása
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
    // Lista törlése
    await lists.destroy({ where: { id: req.params.id, userId: req.id } })
    res.send({ message: 'Sikeresen törölted a listát!' })
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