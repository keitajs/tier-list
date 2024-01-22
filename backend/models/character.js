import { DataTypes } from "sequelize"
import { db } from '../libs/database.js'

const characters = db.define('characters', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(256), allowNull: false },
  position: { type: DataTypes.INTEGER, allowNull: false },
  url: { type: DataTypes.STRING(512), allowNull: true },
  image: { type: DataTypes.STRING(512), allowNull: false }
}, { createdAt: false, updatedAt: false });

export default characters