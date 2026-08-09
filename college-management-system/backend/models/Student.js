const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    rollNumber: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    semester: { type: Number, required: true, min: 1, max: 8 },
    contactNumber: { type: String },
    address: { type: String },
    dateOfBirth: { type: Date },
    guardianName: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
