import { DataTypes } from "sequelize"
import { db } from '../libs/database.js'

const users = db.define('users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(128), allowNull: false },
  password: { type: DataTypes.STRING(128), allowNull: false },
  avatar: { type: DataTypes.STRING(256), allowNull: false, defaultValue: 'dummy.png' },
  status: { type: DataTypes.INTEGER, defaultValue: 0 },
  accessToken: { type: DataTypes.STRING(256), allowNull: true },
  registerDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, { createdAt: false, updatedAt: false });

export default users