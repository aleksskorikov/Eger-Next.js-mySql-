import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/db';
import { Product } from "./product.js";

// === USERS ===
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING(100) },
  first_name: { type: DataTypes.STRING(100) },
  middle_name: { type: DataTypes.STRING(100) },
  phone: { type: DataTypes.STRING(20) },
  city: { type: DataTypes.STRING(100) },
  role: {
    type: DataTypes.ENUM('admin', 'manager', 'client'),
    allowNull: false,
    defaultValue: 'client',
  },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'users',
  timestamps: false,
});

// === STAFF ===
const Staff = sequelize.define('Staff', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  first_name: { type: DataTypes.STRING(100), allowNull: false },
  last_name: { type: DataTypes.STRING(100), allowNull: false },
  middle_name: { type: DataTypes.STRING(100) },
  birth_date: { type: DataTypes.DATEONLY },
  passport_series: { type: DataTypes.STRING(20) },
  passport_issued_by: { type: DataTypes.STRING(255) },
  passport_issued_date: { type: DataTypes.DATEONLY },
  identification_code: { type: DataTypes.STRING(20) },
  employment_date: { type: DataTypes.DATEONLY },
  dismissal_date: { type: DataTypes.DATEONLY },
  role: {
    type: DataTypes.ENUM('admin', 'manager'),
    allowNull: false,
    defaultValue: 'manager',
  },
}, {
  tableName: 'staff',
  timestamps: false,
});

// === CART ===
const Cart = sequelize.define('Cart', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
}, {
  tableName: 'cart',
  timestamps: false,
});

// === ORDER ===
const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER },
  staff_id: { type: DataTypes.INTEGER, allowNull: true }, // Добавлено поле для сотрудника, который принял заказ
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  total_price: { type: DataTypes.FLOAT, allowNull: false },
  surname: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING },
  patronymic: { type: DataTypes.STRING },
  region: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  delivery_method: { type: DataTypes.STRING },
  department: { type: DataTypes.STRING },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') },
}, {
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

// === ORDER ITEM ===
const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  price: { type: DataTypes.FLOAT, allowNull: false }, // цена на момент покупки
}, {
  tableName: 'order_items',
  timestamps: false,
});

// === COMPLETED ORDER ===
const CompletedOrder = sequelize.define('CompletedOrder', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  order_id: { type: DataTypes.INTEGER, allowNull: false },
  total_price: { type: DataTypes.FLOAT, allowNull: false },
  completed_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  staff_id: { type: DataTypes.INTEGER, allowNull: true }, // Добавлено поле для сотрудника, который выполнит заказ
}, {
  tableName: 'completed_orders',
  timestamps: false,
});

// === RELATIONS ===

// Cart ↔ User
User.hasMany(Cart, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'user_id' });

// Cart ↔ Product
Cart.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(Cart, { foreignKey: 'product_id' });

// Order ↔ User
User.hasMany(Order, { foreignKey: 'user_id', onDelete: 'SET NULL' });
Order.belongsTo(User, { foreignKey: 'user_id' });

// Order ↔ Staff (прием заказа)
Staff.hasMany(Order, { foreignKey: 'staff_id', onDelete: 'SET NULL' });
Order.belongsTo(Staff, { foreignKey: 'staff_id' });

// Order ↔ OrderItem
Order.hasMany(OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

// Product ↔ OrderItem
Product.hasMany(OrderItem, { foreignKey: 'product_id', onDelete: 'SET NULL' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

// CompletedOrder ↔ Order
Order.hasOne(CompletedOrder, { foreignKey: 'order_id', onDelete: 'CASCADE' });
CompletedOrder.belongsTo(Order, { foreignKey: 'order_id' });

// CompletedOrder ↔ Staff (выполнение заказа)
Staff.hasMany(CompletedOrder, { foreignKey: 'staff_id', onDelete: 'SET NULL' });
CompletedOrder.belongsTo(Staff, { foreignKey: 'staff_id' });

// models/user.js

CompletedOrder.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(CompletedOrder, { foreignKey: 'order_id' });


export {
  User,
  Staff,
  Cart,
  Order,
  OrderItem,
  CompletedOrder
};
