import { DataTypes } from "sequelize"
import { db } from '../libs/database.js'

const users = db.define('users', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING(128), allowNull: false },
    email: { type: DataTypes.STRING(128), allowNull: false },
    password: { type: DataTypes.STRING(128), allowNull: false },
    image: { type: DataTypes.STRING(256), allowNull: true }
}, { createdAt: false, updatedAt: false });

export default users