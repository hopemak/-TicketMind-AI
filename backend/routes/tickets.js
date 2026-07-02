const express = require('express');
const { body } = require('express-validator');
const {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  deleteTicket
} = require('../controllers/ticketController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  authenticate,
  [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
    body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 5000 })
  ],
  createTicket
);

router.get('/', authenticate, getTickets);
router.get('/:id', authenticate, getTicket);
router.put(
  '/:id',
  authenticate,
  [
    body('status').optional().isIn(['Open', 'In Progress', 'Resolved', 'Closed']),
    body('priority').optional().isIn(['Low', 'Medium', 'High'])
  ],
  updateTicket
);
router.delete('/:id', authenticate, deleteTicket);

module.exports = router;
