const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { createNotification } = require('./notificationHelper');

const createPost = async (req, res) => {
  try {
    const { content, imageUrl } = req.body;
    const post = await Post.create({ user: req.user._id, content, imageUrl });
    await post.populate('user', 'name username avatarUrl');
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   the main feed - posts from people you follow, plus your own,
//         newest first. falls back to everyone's posts if you're not
//         following anyone yet so the feed isn't empty on day one
// @route  GET /api/posts/feed
const getFeed = async (req, res) => {
  try {
    const authorIds = [...req.user.following, req.user._id];

    const filter = req.user.following.length > 0 ? { user: { $in: authorIds } } : {};

    const posts = await Post.find(filter)
      .populate('user', 'name username avatarUrl')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   all posts by one user, used on the profile page
// @route  GET /api/posts/user/:userId
const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate('user', 'name username avatarUrl')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', 'name username avatarUrl');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   like/unlike toggle
// @route  POST /api/posts/:id/like
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyLiked = post.likes.some((id) => id.toString() === req.user._id.toString());

    if (alreadyLiked) {
      post.likes.pull(req.user._id);
    } else {
      post.likes.push(req.user._id);
      await createNotification({ recipient: post.user, sender: req.user._id, type: 'like', post: post._id });
    }

    await post.save();
    res.json({ liked: !alreadyLiked, likesCount: post.likes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only delete your own posts' });
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    res.json({ message: 'Post removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createPost, getFeed, getUserPosts, getPostById, toggleLike, deletePost };
