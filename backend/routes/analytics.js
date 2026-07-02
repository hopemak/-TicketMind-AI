const express = require('express');
const { getDashboardStats, getRecentTickets } = require('../controllers/analyticsController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', authenticate, getDashboardStats);
router.get('/recent', authenticate, getRecentTickets);

module.exports = router;
