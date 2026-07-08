const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { authenticate } = require('../middleware/auth');

router.get('/semantic-search', authenticate, ticketController.semanticSearch);
router.get('/advanced-filter', authenticate, ticketController.getAdvancedFilteredTickets);
router.post('/predict-raw', authenticate, ticketController.predictRawText);
router.post('/', authenticate, ticketController.createTicket);
router.put('/:id/feedback', authenticate, ticketController.submitAiFeedback);
router.post('/batch-csv', authenticate, ticketController.processBatchCsv);

module.exports = router;
