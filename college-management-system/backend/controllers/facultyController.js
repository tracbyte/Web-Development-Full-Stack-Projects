const Faculty = require('../models/Faculty');
const User = require('../models/User');

const createFaculty = async (req, res) => {
  try {
    const { name, email, password, employeeId, department, designation, contactNumber } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = await User.create({ name, email, password, role: 'faculty' });

    const faculty = await Faculty.create({
      user: user._id,
      employeeId,
      department,
      designation,
      contactNumber
    });

    res.status(201).json(faculty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFacultyList = async (req, res) => {
  try {
    const faculty = await Faculty.find()
      .populate('user', 'name email')
      .populate('subjects', 'name code')
      .sort({ createdAt: -1 });
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id)
      .populate('user', 'name email')
      .populate('subjects', 'name code');
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateFaculty = async (req, res) => {
  try {
    const { department, designation, contactNumber } = req.body;

    const faculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      { department, designation, contactNumber },
      { new: true, runValidators: true }
    );

    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });

    await User.findByIdAndDelete(faculty.user);
    await faculty.deleteOne();

    res.json({ message: 'Faculty removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createFaculty, getFacultyList, getFacultyById, updateFaculty, deleteFaculty };
