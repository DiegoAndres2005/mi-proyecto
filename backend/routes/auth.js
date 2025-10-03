const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

// Register (simple)
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Email exists' });
    const hashed = await bcrypt.hash(password, 10);
    const student = await Student.create({ name, email, password: hashed });
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ msg: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, student.password);
    if (!ok) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;