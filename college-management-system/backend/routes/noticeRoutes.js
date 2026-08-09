const express = require('express');
const router = express.Router();
const { createNotice, getNotices, deleteNotice } = require('../controllers/noticeController');
const { protect } = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(protect);

router.route('/')
  .get(getNotices)
  .post(roleCheck('admin', 'faculty'), createNotice);

router.delete('/:id', roleCheck('admin'), deleteNotice);

module.exports = router;
