const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Seller, Product, Brand } = require('../models');
const { loginSchema, addProductSchema, addBrandSchema, paginationQuerySchema, idParamSchema } = require('../validators/sellerValidators');
const fs = require('fs');
const path = require('path');
const { log } = require('console');

const sellerLogin = async (req, res) => {
  // Validate request body
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  const { email, password } = req.body;
  try {
    const seller = await Seller.findOne({ where: { email } });
    if (!seller) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, seller.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ id: seller.id, role: seller.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      path: '/'
    });

    res.json({ 
      message: 'Login successful',
      role: seller.role 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const addProduct = async (req, res) => {
  // Validate request body
  const { error } = addProductSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  const { name, description } = req.body;
  try {
    const product = await Product.create({ 
      name, 
      description, 
      sellerId: req.user.id 
    });
    
    res.status(201).json({ 
      message: 'Product created successfully', 
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        sellerId: product.sellerId
      }
    });
  } catch (err) {
    console.error('Add product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const addBrands = async (req, res) => {
  let { brands } = req.body;
  let brandsArr = brands;

  console.log("Received brands:", brands);

  // If brands is a string, try parsing it
  if (typeof brands === 'string') {
    try {
      brandsArr = JSON.parse(brands);
      console.log("Parsed brandsArr:", brandsArr);
    } catch {
      return res.status(400).json({ message: 'Brands must be a valid JSON array' });
    }
  }

  // Validate using Joi schema
  const { error } = addBrandSchema.validate({ brands: brandsArr });
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  try {
    // Check all productIds exist and belong to the logged-in seller
    const productIds = [...new Set(brandsArr.map(b => b.productId))];
    const products = await Product.findAll({
      where: {
        id: productIds,
        sellerId: req.user.id
      }
    });

    if (products.length !== productIds.length) {
      return res.status(404).json({ message: 'One or more products not found or unauthorized' });
    }

    await Brand.bulkCreate(brandsArr);
    res.status(201).json({
      message: 'Brands added successfully',
      brandsCount: brandsArr.length
    });
  } catch (err) {
    console.error('Add brands error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const listProducts = async (req, res) => {
  // Validate query parameters
  const { error, value } = paginationQuerySchema.validate(req.query);
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  const { page, limit } = value;
  const offset = (page - 1) * limit;
  try {
    const { count, rows } = await Product.findAndCountAll({
      where: { sellerId: req.user.id },
      offset,
      limit,
      order: [['id', 'DESC']],
      include: [{ model: Brand }],
    });
    res.json({
      total: count,
      page,
      pageSize: limit,
      products: rows
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProduct = async (req, res) => {
  // Validate route parameters
  let { id } = req.params;
  // id= parseInt(id);
  console.log("this is id bhushan", id);
  const { error, value } = idParamSchema.validate({ id });
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  const { id: productId } = value;
  try {
    const product = await Product.findOne({ where: { id: productId, sellerId: req.user.id } });
    if (!product) return res.status(404).json({ message: 'Product not found or unauthorized' });
    
    // Delete associated brand images
    const brands = await Brand.findAll({ where: { productId } });
    for (const brand of brands) {
      if (brand.image) {
        const imgPath = path.join('uploads', brand.image);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      }
    }
    
    // Delete brands first (due to foreign key constraint)
    await Brand.destroy({ where: { productId } });
    
    // Delete product
    await product.destroy();
    
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { sellerLogin, addProduct, addBrands, listProducts, deleteProduct }; 