const Notice = require('../models/Notice');

const createNotice = async (req, res) => {
  try {
    const notice = await Notice.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getNotices = async (req, res) => {
  try {
    // students/faculty only see notices meant for them (or everyone)
    const filter = { $or: [{ audience: 'all' }] };
    if (req.user.role === 'student') filter.$or.push({ audience: 'students' });
    if (req.user.role === 'faculty') filter.$or.push({ audience: 'faculty' });
    if (req.user.role === 'admin') delete filter.$or; // admin sees everything

    const notices = await Notice.find(filter).populate('postedBy', 'name role').sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json({ message: 'Notice removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createNotice, getNotices, deleteNotice };
