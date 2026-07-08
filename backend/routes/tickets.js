const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { authenticate } = require('../middleware/auth');

const authBypass = authenticate || ((req, res, next) => next());

router.get('/', authBypass, ticketController.getAllTickets);
router.get('/semantic-search', authBypass, ticketController.semanticSearch);
router.get('/advanced-filter', authBypass, ticketController.getAdvancedFilteredTickets);
router.post('/predict-raw', authBypass, ticketController.predictRawText);
router.post('/', authBypass, ticketController.createTicket);
router.put('/:id/feedback', authBypass, ticketController.submitAiFeedback);
router.post('/batch-csv', authBypass, ticketController.processBatchCsv);

module.exports = router;
