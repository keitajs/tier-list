import { db, checkDatabase } from '../libs/database.js'
import users from '../models/user.js'
import emails from '../models/emails.js'
import sessions from '../models/sessions.js'
import lists from '../models/list.js'
import permissions from '../models/permission.js'
import categories from '../models/category.js'
import characters from '../models/character.js'
import animes from '../models/anime.js'
import updates from '../models/update.js'
import logger from './logger.js'

(async () => {
    try {
        // Adatbázis kapcsolatok

        // Felhasználók - Tokenek | 1:M
        users.hasMany(sessions, { foreignKey: { name: 'userId', allowNull: false }, onDelete: 'CASCADE' })
        sessions.belongsTo(users)

        // Felhasználók - Emailek | 1:1
        emails.hasMany(users, { foreignKey: { name: 'emailId', allowNull: false }, onDelete: 'CASCADE' })
        users.belongsTo(emails)

        // Felhasználók - Listák | 1:M
        users.hasMany(lists, { foreignKey: { name: 'userId', allowNull: false }, onDelete: 'CASCADE' })
        lists.belongsTo(users)

        // Felhasználók - Jogosultságok | M:N
        users.belongsToMany(lists, { through: permissions, foreignKey: { name: 'userId', allowNull: false }, onDelete: 'CASCADE' })
        lists.belongsToMany(users, { through: permissions, foreignKey: { name: 'listId', allowNull: false }, onDelete: 'CASCADE' })
        
        users.hasMany(permissions, { foreignKey: { name: 'userId', allowNull: false }, onDelete: 'CASCADE' })
        permissions.belongsTo(users)

        lists.hasMany(permissions, { foreignKey: { name: 'listId', allowNull: false }, onDelete: 'CASCADE' })
        permissions.belongsTo(users)

        // Felhasználók - Módosítások | M:N
        users.hasMany(updates, { foreignKey: { name: 'userId', allowNull: false }, onDelete: 'CASCADE' })
        updates.belongsTo(users)

        lists.hasMany(updates, { foreignKey: { name: 'listId', allowNull: false }, onDelete: 'CASCADE' })
        updates.belongsTo(lists)

        // Listák - Kategóriák | 1:M
        lists.hasMany(categories, { foreignKey: { name: 'listId', allowNull: false }, onDelete: 'CASCADE' })
        categories.belongsTo(lists)

        // Kategóriák - Karakterek | 1:M
        categories.hasMany(characters, { foreignKey: { name: 'categoryId', allowNull: false }, onDelete: 'CASCADE' })
        characters.belongsTo(categories)

        // Animek - Karakterek | 1:M
        animes.hasMany(characters, { foreignKey: { name: 'animeId', allowNull: true }, onDelete: 'CASCADE' })
        characters.belongsTo(animes)

        await checkDatabase()
        await db.sync()
    } catch (error) {
        logger.error(error)
    }
})()

export default null