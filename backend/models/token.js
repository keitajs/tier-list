import { DataTypes } from 'sequelize'
import { db } from '../libs/database.js'

const tokens = db.define('tokens', {
  token: { type: DataTypes.STRING(256), primaryKey: true, allowNull: false },
  expDate: { type: DataTypes.DATE, allowNull: false }
}, { createdAt: false, updatedAt: false });

export default tokens