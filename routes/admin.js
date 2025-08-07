const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { adminRegistration, adminLogin, createSeller, listSellers } = require('../controllers/adminController');

// POST /admin/register (one-time only)
router.post('/register', adminRegistration);

// POST /admin/login
router.post('/login', adminLogin);

// POST /admin/sellers
router.post('/sellers', authenticateToken, authorizeRoles('admin'), createSeller);

// GET /admin/sellers (pagination)
router.get('/sellers', authenticateToken, authorizeRoles('admin'), listSellers);

module.exports = router; 