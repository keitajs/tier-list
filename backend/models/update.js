import { DataTypes } from 'sequelize'
import { db } from '../libs/database.js'

const updates = db.define('updates', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  time: { type: DataTypes.TIME, allowNull: false }
}, { createdAt: false, updatedAt: false });

export default updates