import { DataTypes } from 'sequelize'
import { db } from '../libs/database.js'

const sessions = db.define('sessions', {
  token: { type: DataTypes.STRING(256), primaryKey: true, allowNull: false }
}, { createdAt: false, updatedAt: false });

export default sessions