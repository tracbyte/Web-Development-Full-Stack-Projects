const express = require('express');
const router = express.Router();
const { relatedProducts, forYou } = require('../controllers/recommendationController');
const { optionalAuth } = require('../middleware/auth');

router.get('/related/:productId', relatedProducts);
router.get('/for-you', optionalAuth, forYou); // guests get trending products instead

module.exports = router;
