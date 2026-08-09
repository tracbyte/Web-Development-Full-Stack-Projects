const express = require('express');
const router = express.Router();
const {
  createFaculty,
  getFacultyList,
  getFacultyById,
  updateFaculty,
  deleteFaculty
} = require('../controllers/facultyController');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(protect);

router.route('/')
  .get(getFacultyList)
  .post(roleCheck('admin'), createFaculty);

router.route('/:id')
  .get(getFacultyById)
  .put(roleCheck('admin'), updateFaculty)
  .delete(roleCheck('admin'), deleteFaculty);

module.exports = router;
