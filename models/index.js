const sequelize = require('../config');
const Admin = require('./Admin');
const Seller = require('./Seller');
const Product = require('./Product');
const Brand = require('./Brand');

Seller.hasMany(Product, { foreignKey: 'sellerId' });
Product.belongsTo(Seller, { foreignKey: 'sellerId' });

Product.hasMany(Brand, { foreignKey: 'productId' });
Brand.belongsTo(Product, { foreignKey: 'productId' });

module.exports = { sequelize, Admin, Seller, Product, Brand }; 