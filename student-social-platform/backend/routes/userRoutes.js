const express = require('express');
const router = express.Router();
const { getUserProfile, updateProfile, searchUsers, toggleFollow } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/', protect, searchUsers); // ?search=query
router.put('/me', protect, updateProfile);
router.post('/:id/follow', protect, toggleFollow);
router.get('/:username', protect, getUserProfile);

module.exports = router;
