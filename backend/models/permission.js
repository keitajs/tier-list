import { DataTypes } from "sequelize"
import { db } from '../libs/database.js'

const permissions = db.define('permissions', {
  value: { type: DataTypes.INTEGER(1), allowNull: false, defaultValue: 1 }
}, { createdAt: false, updatedAt: false });

export default permissions