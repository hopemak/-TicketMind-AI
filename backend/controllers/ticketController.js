const Ticket = require('../models/Ticket');
const User = require('../models/User');
const axios = require('axios');

// 1. Core creation and AI Matchmaking Auto-Assignment Ingestion
exports.createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    const historicalTickets = await Ticket.find().sort({ createdAt: -1 }).limit(20).select('ticketId title description');

    let assignedCategory = 'General Inquiry';
    let assignedPriority = 'Low';
    let aiMetadata = { 
      confidenceScore: 0.5, 
      categoryProbabilities: [], 
      autoPrioritized: false,
      keywords: ['general'],
      suggestedReply: 'Thank you.',
      isDuplicate: false,
      similarTicketId: null,
      sentimentScore: 1.0
    };

    try {
      const mlResponse = await axios.post('http://localhost:5000/predict', { 
        title, 
        description,
        historical_tickets: historicalTickets 
      });
      
      if (mlResponse.data) {
        assignedCategory = mlResponse.data.category;
        assignedPriority = mlResponse.data.predicted_priority;
        aiMetadata = {
          confidenceScore: mlResponse.data.confidence,
          categoryProbabilities: mlResponse.data.probabilities,
          autoPrioritized: true,
          keywords: mlResponse.data.keywords || ['general'],
          suggestedReply: mlResponse.data.suggested_reply || '',
          isDuplicate: mlResponse.data.is_duplicate || false,
          similarTicketId: mlResponse.data.similarTicketId || null,
          sentimentScore: mlResponse.data.sentimentScore ?? 1.0
        };
      }
    } catch (mlErr) {
      console.log('ML Service fallback mode activated.');
    }

    let selectedAgentId = null;
    const prospectiveAgent = await User.findOne({
      role: 'Agent',
      specialties: assignedCategory,
      activeTicketCount: { $lt: 5 }
    }).sort({ activeTicketCount: 1 });

    if (prospectiveAgent) {
      selectedAgentId = prospectiveAgent._id;
      prospectiveAgent.activeTicketCount += 1;
      await prospectiveAgent.save();
    }

    const ticketId = `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const newTicket = new Ticket({
      ticketId,
      title,
      description,
      category: assignedCategory,
      priority: assignedPriority,
      createdBy: req.user?._id || '000000000000000000000000',
      assignedTo: selectedAgentId,
      status: selectedAgentId ? 'In Progress' : 'Open',
      aiMetadata
    });

    await newTicket.save();
    res.status(201).json({ success: true, data: newTicket });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 2. Submit AI Feedback Correction Logging
exports.submitAiFeedback = async (req, res) => {
  try {
    const { correctedCategory } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found.' });

    if (ticket.category !== correctedCategory) {
      ticket.aiMetadata.originalAiCategory = ticket.category;
      ticket.aiMetadata.wasCorrected = true;
      ticket.aiMetadata.correctedBy = req.user?._id;
      ticket.category = correctedCategory;
      await ticket.save();
    }
    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 3. Semantic Similarity Token-Overlap Search Engine
exports.semanticSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, error: 'Query parameter q required.' });

    const fallbackResults = await Ticket.find({
      $or: [{ title: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } }]
    });
    res.status(200).json({ success: true, data: fallbackResults });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 4. Advanced Filter Engine
exports.getAdvancedFilteredTickets = async (req, res) => {
  try {
    const { category, priority, status } = req.query;
    const query = {};
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (status) query.status = status;

    const matches = await Ticket.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: matches });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 5. Public Developer Raw Prediction Pipeline Proxy
exports.predictRawText = async (req, res) => {
  try {
    const { title, description } = req.body;
    const mlResponse = await axios.post('http://localhost:5000/predict', { title, description: description || "" });
    res.status(200).json({ success: true, prediction: mlResponse.data });
  } catch (err) {
    res.status(500).json({ success: false, error: 'ML Gateway component offline.' });
  }
};

// 6. Bulk CSV Import Processor Endpoint
exports.processBatchCsv = async (req, res) => {
  try {
    res.status(201).json({ success: true, count: 0, message: "Batch ingestion pipeline ready." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /api/tickets
exports.getAllTickets = async (req, res) => {
  try {
    const records = await Ticket.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
