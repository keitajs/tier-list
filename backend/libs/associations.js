import { db, checkDatabase } from '../libs/database.js'
import users from '../models/user.js'

(async () => {
    // adatbázis kapcsolatok ide jönnek

    await checkDatabase()
    await db.sync()
})()

export default null