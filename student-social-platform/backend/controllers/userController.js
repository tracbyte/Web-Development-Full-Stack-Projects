const User = require('../models/User');
const { createNotification } = require('./notificationHelper');

// @desc   profile by username, this is what the profile page hits
// @route  GET /api/users/:username
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   update your own bio/college/avatar - not username/email here on purpose
// @route  PUT /api/users/me
const updateProfile = async (req, res) => {
  try {
    const { bio, college, avatarUrl, name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { bio, college, avatarUrl, name },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   simple search by name/username/college, used on the Explore page
// @route  GET /api/users?search=...
const searchUsers = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) return res.json([]);

    const regex = new RegExp(search, 'i');
    const users = await User.find({
      $or: [{ name: regex }, { username: regex }, { college: regex }]
    })
      .select('name username college avatarUrl')
      .limit(20);

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   follow/unfollow toggle - one endpoint handles both directions
// @route  POST /api/users/:id/follow
const toggleFollow = async (req, res) => {
  try {
    const targetId = req.params.id;
    if (targetId === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ message: 'User not found' });

    const alreadyFollowing = target.followers.some((f) => f.toString() === req.user._id.toString());

    if (alreadyFollowing) {
      target.followers.pull(req.user._id);
      req.user.following.pull(targetId);
    } else {
      target.followers.push(req.user._id);
      req.user.following.push(targetId);
      await createNotification({ recipient: target._id, sender: req.user._id, type: 'follow' });
    }

    await target.save();
    await req.user.save();

    res.json({ following: !alreadyFollowing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getUserProfile, updateProfile, searchUsers, toggleFollow };
