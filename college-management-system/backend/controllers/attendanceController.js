const Attendance = require('../models/Attendance');

// @desc   mark attendance for one student, one course, one day
// @route  POST /api/attendance
const markAttendance = async (req, res) => {
  try {
    const { student, course, date, status } = req.body;

    // upsert so faculty can correct a mistake by re-submitting for the same day
    const record = await Attendance.findOneAndUpdate(
      { student, course, date: date || new Date().setHours(0, 0, 0, 0) },
      { status, markedBy: req.body.markedBy },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   attendance records, filterable by student or course
// @route  GET /api/attendance
const getAttendance = async (req, res) => {
  try {
    const filter = {};
    if (req.query.student) filter.student = req.query.student;
    if (req.query.course) filter.course = req.query.course;

    const records = await Attendance.find(filter)
      .populate('student', 'rollNumber')
      .populate('course', 'name code')
      .sort({ date: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   quick percentage summary for a student in a course
// @route  GET /api/attendance/summary/:studentId/:courseId
const getAttendanceSummary = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    const total = await Attendance.countDocuments({ student: studentId, course: courseId });
    const present = await Attendance.countDocuments({
      student: studentId,
      course: courseId,
      status: 'present'
    });

    const percentage = total === 0 ? 0 : ((present / total) * 100).toFixed(2);

    res.json({ total, present, absent: total - present, percentage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { markAttendance, getAttendance, getAttendanceSummary };
