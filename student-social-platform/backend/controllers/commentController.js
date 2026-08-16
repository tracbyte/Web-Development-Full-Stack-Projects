const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { createNotification } = require('./notificationHelper');

const addComment = async (req, res) => {
  try {
    const { post: postId, text } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = await Comment.create({ post: postId, user: req.user._id, text });
    await comment.populate('user', 'name username avatarUrl');

    post.commentsCount += 1;
    await post.save();

    await createNotification({ recipient: post.user, sender: req.user._id, type: 'comment', post: postId });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPostComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('user', 'name username avatarUrl')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only delete your own comments' });
    }

    await comment.deleteOne();
    await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });

    res.json({ message: 'Comment removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addComment, getPostComments, deleteComment };
