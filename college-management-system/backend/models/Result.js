const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    semester: { type: Number, required: true },
    marksObtained: { type: Number, required: true, min: 0 },
    maxMarks: { type: Number, default: 100 },
    grade: { type: String }
  },
  { timestamps: true }
);

// auto calculate a simple letter grade before saving
// feel free to swap this for your college's actual grading scheme
resultSchema.pre('save', function (next) {
  const percentage = (this.marksObtained / this.maxMarks) * 100;
  if (percentage >= 90) this.grade = 'A+';
  else if (percentage >= 80) this.grade = 'A';
  else if (percentage >= 70) this.grade = 'B';
  else if (percentage >= 60) this.grade = 'C';
  else if (percentage >= 40) this.grade = 'D';
  else this.grade = 'F';
  next();
});

module.exports = mongoose.model('Result', resultSchema);
