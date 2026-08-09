const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(protect);

router.route('/')
  .get(getCourses)
  .post(roleCheck('admin'), createCourse);

router.route('/:id')
  .get(getCourseById)
  .put(roleCheck('admin'), updateCourse)
  .delete(roleCheck('admin'), deleteCourse);

module.exports = router;
