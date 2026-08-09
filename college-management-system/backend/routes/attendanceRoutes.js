const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAttendance,
  getAttendanceSummary
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(protect);

router.post('/', roleCheck('admin', 'faculty'), markAttendance);
router.get('/', getAttendance);
router.get('/summary/:studentId/:courseId', getAttendanceSummary);

module.exports = router;
