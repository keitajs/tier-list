import { db, checkDatabase } from '../libs/database.js'
import users from '../models/user.js'
import lists from '../models/list.js'

(async () => {
    // Adatbázis kapcsolatok
    users.hasMany(lists, { foreignKey: { name: 'userId', allowNull: false }, onDelete: 'CASCADE' })
    lists.belongsTo(users)

    await checkDatabase()
    await db.sync()
})()

export default null