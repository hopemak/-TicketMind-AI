const express = require('express');
const router = express.Router();

router.get('/me', (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: '000000000000000000000000',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'admin'
    }
  });
});

module.exports = router;
