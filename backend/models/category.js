import { DataTypes } from "sequelize"
import { db } from '../libs/database.js'

const categories = db.define('categories', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(32), allowNull: true },
  position: { type: DataTypes.INTEGER, allowNull: true },
  color: { type: DataTypes.STRING(32), allowNull: true, defaultValue: '#ffffff' }
}, { createdAt: false, updatedAt: false });

export default categories