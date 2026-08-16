const express = require('express');
const router = express.Router();
const {
  createPost,
  getFeed,
  getUserPosts,
  getPostById,
  toggleLike,
  deletePost
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');

router.use(protect); // this whole app is behind login, keeps things simple

router.post('/', createPost);
router.get('/feed', getFeed);
router.get('/user/:userId', getUserPosts);
router.get('/:id', getPostById);
router.post('/:id/like', toggleLike);
router.delete('/:id', deletePost);

module.exports = router;
