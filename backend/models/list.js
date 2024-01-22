import { DataTypes } from "sequelize"
import { db } from '../libs/database.js'

const lists = db.define('lists', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(128), allowNull: false },
  description: { type: DataTypes.STRING(256), allowNull: false, defaultValue: '' },
  status: { type: DataTypes.INTEGER(1), allowNull: false, defaultValue: 1 },
  private: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, { createdAt: false, updatedAt: false });

export default lists