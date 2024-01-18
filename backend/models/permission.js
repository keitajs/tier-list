import { DataTypes } from "sequelize"
import { db } from '../libs/database.js'

const permissions = db.define('permissions', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    value: { type: DataTypes.INTEGER(1), allowNull: false, defaultValue: 1 }
}, { createdAt: false, updatedAt: false });

export default permissions