const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
  title: String,
  teacher: String,
  materials: [String]
});
module.exports = mongoose.model('Course', CourseSchema);