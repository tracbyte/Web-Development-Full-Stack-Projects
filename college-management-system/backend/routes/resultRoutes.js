const express = require('express');
const router = express.Router();
const { addResult, getResults, updateResult, deleteResult } = require('../controllers/resultController');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(protect);

router.route('/')
  .get(getResults)
  .post(roleCheck('admin', 'faculty'), addResult);

router.route('/:id')
  .put(roleCheck('admin', 'faculty'), updateResult)
  .delete(roleCheck('admin'), deleteResult);

module.exports = router;
