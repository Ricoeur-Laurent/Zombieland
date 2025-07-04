import dotenv from 'dotenv';
import { sequelize } from './sequelize.js';

dotenv.config();

import { Users } from './users.js';
import { Reviews } from './reviews.js';
import { Reservations } from './reservations.js';
import { Attractions } from './attractions.js';
import { Categories } from './categories.js';

Users.hasMany(Reviews, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  }
})

Reviews.belongsTo(Users, {
  foreignKey: {
    name: "userId",
    allowNull: false
  }
})

Users.hasMany(Reservations, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  }
})

Reservations.belongsTo(Users, {
  foreignKey: {
    name: "userId",
    allowNull: false
  }
})

Attractions.hasMany(Reviews, {
  foreignKey: {
    name: 'attractionId',
    allowNull: false
  }
})

Reviews.belongsTo(Attractions, {
  foreignKey: {
    name: "attractionId",
    allowNull: false
  }
})

Attractions.belongsToMany(Categories, {
  through: 'attractions_has_categories',
  foreignKey: 'attractionId',
  otherKey: 'categoryId'
});

Categories.belongsToMany(Attractions, {
  through: 'attractions_has_categories',
  foreignKey: 'categoryId',
  otherKey: 'attractionId'
});

export { sequelize, Users, Reservations, Attractions, Reviews, Categories };