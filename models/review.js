import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/db';
import { User, Staff } from './user.js';
import { Product } from './product.js';

const Review = sequelize.define('Review', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    staff_id: { type: DataTypes.INTEGER, allowNull: true },
    comment: { type: DataTypes.TEXT, allowNull: false },
    response: { type: DataTypes.TEXT, allowNull: true },
    messages: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
    },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
    tableName: 'reviews',
    timestamps: false,
});



Review.belongsTo(User, { foreignKey: 'user_id' });
Review.belongsTo(Staff, { foreignKey: 'staff_id' });
Review.belongsTo(Product, { foreignKey: 'product_id' });

User.hasMany(Review, { foreignKey: 'user_id' });
Staff.hasMany(Review, { foreignKey: 'staff_id' });
Product.hasMany(Review, { foreignKey: 'product_id' });

export { Review };


