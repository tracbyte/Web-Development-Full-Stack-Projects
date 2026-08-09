const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, optionalAuth } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// browsing is public, but optionalAuth lets us personalize when a token is present
router.get('/', getProducts);
router.get('/:id', optionalAuth, getProductById);

router.post('/', protect, roleCheck('admin'), createProduct);
router.put('/:id', protect, roleCheck('admin'), updateProduct);
router.delete('/:id', protect, roleCheck('admin'), deleteProduct);

module.exports = router;
