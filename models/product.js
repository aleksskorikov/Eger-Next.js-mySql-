import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/db';

const ProductGroup = sequelize.define('ProductGroup', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'product_groups', timestamps: false });

const Category = sequelize.define('Category', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    group_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: ProductGroup, key: 'id' } },
    name: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'categories', timestamps: false });

const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    category_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Category, key: 'id' } },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2) },
    description: { type: DataTypes.TEXT },
    status: { type: DataTypes.BOOLEAN, defaultValue: false },
    isOnSale: { type: DataTypes.BOOLEAN, defaultValue: false },
    sale_price: { type: DataTypes.FLOAT, allowNull: true },
    article: {
        type: DataTypes.STRING(6),
        allowNull: false,
        unique: true,
        validate: {
            is: /^\d{6}$/ 
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'products',
    timestamps: false,
    hooks: {
        beforeCreate: async (product) => {
            if (!product.article) {
                let unique = false;
                while (!unique) {
                    const generated = String(Math.floor(100000 + Math.random() * 900000));
                    const existing = await Product.findOne({ where: { article: generated } });
                    if (!existing) {
                        product.article = generated;
                        unique = true;
                    }
                }
            }
        }
    }
});


const ProductImage = sequelize.define('ProductImage', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    product_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: 'id' } },
    image_url: { type: DataTypes.STRING }
}, { tableName: 'product_images', timestamps: false });

const ProductDescription = sequelize.define('ProductDescription', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    product_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: 'id' } },
    description_text: { type: DataTypes.TEXT },
    description_order: { type: DataTypes.INTEGER }
}, { tableName: 'product_descriptions', timestamps: false });

ProductGroup.hasMany(Category, { foreignKey: 'group_id' });
Category.belongsTo(ProductGroup, { foreignKey: 'group_id' });

Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

Product.hasMany(ProductImage, { foreignKey: 'product_id' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasMany(ProductDescription, { foreignKey: 'product_id' });
ProductDescription.belongsTo(Product, { foreignKey: 'product_id' });

export {
    sequelize,
    ProductGroup,
    Category,
    Product,
    ProductImage,
    ProductDescription
};







