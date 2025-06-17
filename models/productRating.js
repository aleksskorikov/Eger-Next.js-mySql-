import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/db.js';
import { Product } from './product.js';
import { User } from './user.js';

const ProductRating = sequelize.define('ProductRating', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'product_ratings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['product_id', 'user_id'],
    },
  ],
});

// Associations
Product.hasMany(ProductRating, { foreignKey: 'product_id' });
ProductRating.belongsTo(Product, { foreignKey: 'product_id' });

User.hasMany(ProductRating, { foreignKey: 'user_id' });
ProductRating.belongsTo(User, { foreignKey: 'user_id' });

export { ProductRating };
