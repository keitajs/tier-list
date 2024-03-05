import { DataTypes } from "sequelize"
import { db } from '../libs/database.js'

const users = db.define('users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(128), allowNull: false },
  email: { type: DataTypes.STRING(128), allowNull: false },
  password: { type: DataTypes.STRING(128), allowNull: false },
  avatar: { type: DataTypes.STRING(256), allowNull: false, defaultValue: 'dummy.png' },
  status: { type: DataTypes.INTEGER, defaultValue: 0 },
  verifyToken: { type: DataTypes.STRING(64), allowNull: true },
  registerDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, { createdAt: false, updatedAt: false });

export default users