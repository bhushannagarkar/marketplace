const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const upload = require('../middleware/multer/upload');
const { sellerLogin, addProduct, addBrands, listProducts, deleteProduct } = require('../controllers/sellerController');

// POST /seller/login
router.post('/login', sellerLogin);

// POST /seller/products (create product only)
router.post('/products', 
  authenticateToken, 
  authorizeRoles('seller'), 
  addProduct
);

// POST /seller/products/:id/brands (add brands to existing product)
router.post('/products/:id/brands', 
  authenticateToken, 
  authorizeRoles('seller'), 
  upload.array('brandImages'), 
  addBrands
);

// GET /seller/products (pagination)
router.get('/products', 
  authenticateToken, 
  authorizeRoles('seller'), 
  listProducts
);

// DELETE /seller/products/:id
router.delete('/products/:id', 
  authenticateToken, 
  authorizeRoles('seller'), 
  deleteProduct
);

module.exports = router; 