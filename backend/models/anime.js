import { DataTypes } from "sequelize"
import { db } from '../libs/database.js'

const animes = db.define('animes', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(256), allowNull: false },
  url: { type: DataTypes.STRING(512), allowNull: true }
}, { createdAt: false, updatedAt: false });

export default animes