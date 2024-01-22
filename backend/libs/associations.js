import { db, checkDatabase } from '../libs/database.js'
import users from '../models/user.js'
import lists from '../models/list.js'
import permissions from '../models/permission.js'
import categories from '../models/category.js'
import characters from '../models/character.js'
import animes from '../models/anime.js'

(async () => {
    // Adatbázis kapcsolatok
    users.hasMany(lists, { foreignKey: { name: 'userId', allowNull: false }, onDelete: 'CASCADE' })
    lists.belongsTo(users)

    users.hasMany(permissions, { foreignKey: { name: 'userId', allowNull: false }, onDelete: 'CASCADE' })
    permissions.belongsTo(users)

    lists.hasMany(permissions, { foreignKey: { name: 'listId', allowNull: false }, onDelete: 'CASCADE' })
    permissions.belongsTo(users)

    lists.hasMany(categories, { foreignKey: { name: 'listId', allowNull: false }, onDelete: 'CASCADE' })
    categories.belongsTo(lists)

    categories.hasMany(characters, { foreignKey: { name: 'categoryId', allowNull: false }, onDelete: 'CASCADE' })
    characters.belongsTo(categories)

    animes.hasMany(characters, { foreignKey: { name: 'animeId', allowNull: false }, onDelete: 'CASCADE' })
    characters.belongsTo(animes)

    await checkDatabase()
    await db.sync()
})()

export default null