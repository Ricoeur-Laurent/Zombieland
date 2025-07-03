import { sequelize } from './sequelize.js';
import { Model, DataTypes } from 'sequelize';

export class Reviews extends Model { }

Reviews.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: "reviews",
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
