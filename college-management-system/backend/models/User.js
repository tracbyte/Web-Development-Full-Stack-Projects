const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// this is the base login identity for everyone - admin, faculty and students
// student/faculty specific details live in their own collections and link back here
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ['admin', 'faculty', 'student'],
      default: 'student'
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// hash password only if it was changed/new
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
