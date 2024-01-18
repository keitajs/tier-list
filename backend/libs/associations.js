import { db, checkDatabase } from '../libs/database.js'
import users from '../models/user.js'
import lists from '../models/list.js'
import permissions from '../models/permission.js'

(async () => {
    // Adatbázis kapcsolatok
    users.hasMany(lists, { foreignKey: { name: 'userId', allowNull: false }, onDelete: 'CASCADE' })
    lists.belongsTo(users)

    users.hasMany(permissions, { foreignKey: { name: 'userId', allowNull: false }, onDelete: 'CASCADE' })
    permissions.belongsTo(users)

    lists.hasMany(permissions, { foreignKey: { name: 'listId', allowNull: false }, onDelete: 'CASCADE' })
    permissions.belongsTo(users)

    await checkDatabase()
    await db.sync()
})()

export default null