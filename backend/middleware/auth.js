const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Student.findById(payload.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token invalid' });
  }
};