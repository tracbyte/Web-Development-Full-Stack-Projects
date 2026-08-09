const express = require('express');
const router = express.Router();
const { createCategory, getCategories, deleteCategory } = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', getCategories);
router.post('/', protect, roleCheck('admin'), createCategory);
router.delete('/:id', protect, roleCheck('admin'), deleteCategory);

module.exports = router;
