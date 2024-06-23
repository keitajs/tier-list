import { DataTypes } from 'sequelize'
import { db } from '../libs/database.js'

const emails = db.define('emails', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  address: { type: DataTypes.STRING(128), allowNull: false },
  code: { type: DataTypes.STRING(6), allowNull: true },
  expDate: { type: DataTypes.DATE, allowNull: false }
}, { createdAt: false, updatedAt: false });

export default emails