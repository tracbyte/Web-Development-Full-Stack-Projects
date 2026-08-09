const Student = require('../models/Student');
const User = require('../models/User');

// @desc   create a student - makes a User (role=student) + Student profile together
// @route  POST /api/students
const createStudent = async (req, res) => {
  try {
    const { name, email, password, rollNumber, department, semester, contactNumber, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = await User.create({ name, email, password, role: 'student' });

    const student = await Student.create({
      user: user._id,
      rollNumber,
      department,
      semester,
      contactNumber,
      address
    });

    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   list all students, newest first
// @route  GET /api/students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('user', 'name email isActive')
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   single student by id
// @route  GET /api/students/:id
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('user', 'name email');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   update student details (not password/email here, keep that separate)
// @route  PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const { department, semester, contactNumber, address, guardianName } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { department, semester, contactNumber, address, guardianName },
      { new: true, runValidators: true }
    );

    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   remove a student and the linked user account
// @route  DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    await User.findByIdAndDelete(student.user);
    await student.deleteOne();

    res.json({ message: 'Student removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createStudent, getStudents, getStudentById, updateStudent, deleteStudent };
