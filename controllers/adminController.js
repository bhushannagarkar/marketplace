const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Admin, Seller } = require('../models');
const { loginSchema, adminRegistrationSchema, createSellerSchema, paginationQuerySchema } = require('../validators/adminValidators');

const adminRegistration = async (req, res) => {
  // Validate request body
  const { error } = adminRegistrationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  const { name, email, password, confirmPassword } = req.body;
  console.log("this is the body", req.body);
  
  try {
    // Check if any admin already exists
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.status(403).json({ 
        message: 'Admin registration is only allowed once. An admin already exists.',
        error: 'ADMIN_ALREADY_EXISTS'
      });
    }

    // Check if email is already taken
    const existingUser = await Admin.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ 
        message: 'Email already registered',
        error: 'EMAIL_ALREADY_EXISTS'
      });
    }

    // Additional password confirmation check (redundant but explicit)
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Password confirmation does not match',
        error: 'PASSWORD_MISMATCH'
      });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await Admin.create({ 
      name, 
      email, 
      password: hash,
      role: 'admin'
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, role: admin.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      path: '/'
    });

    console.log(`Admin registered successfully: ${admin.email}`);

    res.status(201).json({ 
      message: 'Admin registered successfully',
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    console.error('Admin registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const adminLogin = async (req, res) => {
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
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
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
      role: admin.role 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createSeller = async (req, res) => {
  // Validate request body
  const { error } = createSellerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  const { name, email, mobile, country, state, skills, password } = req.body;
  try {
    const exists = await Seller.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: 'Seller already exists' });
    const hash = await bcrypt.hash(password, 10);
    const seller = await Seller.create({ name, email, mobile, country, state, skills, password: hash });
    res.status(201).json({ message: 'Seller created', seller: { id: seller.id, name, email, mobile, country, state, skills } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const listSellers = async (req, res) => {
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
    const { count, rows } = await Seller.findAndCountAll({
      offset,
      limit,
      attributes: { exclude: ['password'] },
      order: [['id', 'DESC']]
    });
    res.json({
      total: count,
      page,
      pageSize: limit,
      sellers: rows
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { adminRegistration, adminLogin, createSeller, listSellers }; 