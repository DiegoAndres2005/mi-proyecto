const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get my profile
router.get('/me', auth, (req, res) => {
  res.json(req.user);
});

module.exports = router;