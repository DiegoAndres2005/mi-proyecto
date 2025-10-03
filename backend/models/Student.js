const mongoose = require('mongoose');
const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'student' },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});
module.exports = mongoose.model('Student', StudentSchema);