const express = require('express');
const router = express.Router();
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(protect); // every route below needs a logged in user

router.route('/')
  .get(getStudents)
  .post(roleCheck('admin'), createStudent);

router.route('/:id')
  .get(getStudentById)
  .put(roleCheck('admin'), updateStudent)
  .delete(roleCheck('admin'), deleteStudent);

module.exports = router;
