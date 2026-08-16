const express = require('express');
const router = express.Router();
const { addComment, getPostComments, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', addComment);
router.get('/post/:postId', getPostComments);
router.delete('/:id', deleteComment);

module.exports = router;
