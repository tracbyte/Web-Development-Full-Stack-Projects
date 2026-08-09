const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    audience: {
      type: String,
      enum: ['all', 'students', 'faculty'],
      default: 'all'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notice', noticeSchema);
