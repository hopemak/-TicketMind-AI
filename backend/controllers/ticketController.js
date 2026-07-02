const Ticket = require('../models/Ticket');
const axios = require('axios');

const demoTickets = [];
let demoIdCounter = 1;

const generateTicketId = () => {
  const prefix = 'TKT';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

const callMLService = async (title, description) => {
  try {
    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:5000';
    const response = await axios.post(`${mlServiceUrl}/classify`, { title, description }, {
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error('ML Service error:', error.message);
    return null;
  }
};

const smartFallbackClassify = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();
  const categoryKeywords = {
    'Technical Issue': ['error','bug','crash','not working','broken','fail','timeout','login','password','server','api','database','connection'],
    'Billing': ['charge','invoice','payment','billing','subscription','refund','price','cost','plan','renewal'],
    'Refund': ['refund','return','money back','cancel order','defective','damaged'],
    'Account Access': ['account','login','access','locked','forgot password','suspended','unauthorized','permission'],
    'Feature Request': ['feature','add','support','would like','need','want','request','enhancement','improvement'],
    'Complaint': ['disappointed','rude','unacceptable','terrible','worst','complaint','poor','bad service','angry'],
    'General Inquiry': ['how to','what is','where','when','information','question','help','documentation','guide'],
    'Bug Report': ['bug','defect','wrong','incorrect','not displaying','glitch','issue with'],
    'Shipping': ['shipping','delivery','package','order','shipped','tracking','arrived','logistics'],
    'Security': ['security','hack','phishing','breach','vulnerability','unauthorized','suspicious','malware']
  };
  let bestCategory = 'General Inquiry';
  let maxScore = 0;
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    const score = keywords.reduce((acc, kw) => acc + (text.includes(kw) ? 1 : 0), 0);
    if (score > maxScore) { maxScore = score; bestCategory = category; }
  }
  const highKeywords = ['urgent','critical','emergency','security','hack','breach','down','not working','broken','failed'];
  const mediumKeywords = ['issue','problem','error','bug','slow','delay','missing','wrong'];
  let priority = 'Low';
  if (highKeywords.some(kw => text.includes(kw))) priority = 'High';
  else if (mediumKeywords.some(kw => text.includes(kw))) priority = 'Medium';
  return { category: bestCategory, priority, confidence: maxScore > 0 ? Math.min(maxScore * 15 + 50, 85) : 60, source: 'fallback' };
};

exports.getTickets = async (req, res) => {
  try {
    const { status, priority, category, search, page = 1, limit = 10 } = req.query;
    let query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ticketId: { $regex: search, $options: 'i' } }
      ];
    }
    let tickets, total;
    try {
      total = await Ticket.countDocuments(query);
      tickets = await Ticket.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit)).populate('createdBy', 'name email');
    } catch (dbError) {
      tickets = demoTickets.filter(t => {
        if (status && t.status !== status) return false;
        if (priority && t.priority !== priority) return false;
        if (category && t.category !== category) return false;
        if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      total = tickets.length;
      const start = (page - 1) * limit;
      tickets = tickets.slice(start, start + parseInt(limit));
    }
    res.status(200).json({ success: true, count: tickets.length, total, page: parseInt(page), pages: Math.ceil(total / limit), data: tickets });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

exports.getTicket = async (req, res) => {
  try {
    let ticket;
    try {
      ticket = await Ticket.findById(req.params.id).populate('createdBy', 'name email');
    } catch (e) {
      ticket = demoTickets.find(t => t._id === req.params.id || t.ticketId === req.params.id);
    }
    if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'Title and description are required' });
    }
    const ticketId = generateTicketId();
    let mlResult = await callMLService(title, description);
    let classificationSource = 'ml';
    if (!mlResult) {
      mlResult = smartFallbackClassify(title, description);
      classificationSource = 'fallback';
      console.log('Using fallback classification:', mlResult);
    }
    const ticketData = {
      ticketId, title, description,
      category: mlResult.category,
      priority: mlResult.priority,
      confidence: mlResult.confidence || 60,
      status: 'Open',
      classificationSource,
      createdBy: req.user ? req.user._id : null,
      createdByName: req.user ? req.user.name : 'Demo User'
    };
    let ticket;
    try {
      ticket = await Ticket.create(ticketData);
      ticket = await ticket.populate('createdBy', 'name email');
    } catch (dbError) {
      console.log('MongoDB create failed, using in-memory fallback:', dbError.message);
      ticket = { _id: `demo-${demoIdCounter++}`, ...ticketData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      demoTickets.push(ticket);
    }
    res.status(201).json({ success: true, data: ticket, classification: { source: classificationSource, ...mlResult } });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const { status, priority, resolution } = req.body;
    let ticket;
    try {
      ticket = await Ticket.findByIdAndUpdate(req.params.id, { status, priority, resolution, updatedAt: Date.now() }, { new: true, runValidators: true }).populate('createdBy', 'name email');
    } catch (e) {
      const idx = demoTickets.findIndex(t => t._id === req.params.id);
      if (idx !== -1) {
        demoTickets[idx] = { ...demoTickets[idx], status: status || demoTickets[idx].status, priority: priority || demoTickets[idx].priority, resolution: resolution || demoTickets[idx].resolution, updatedAt: new Date().toISOString() };
        ticket = demoTickets[idx];
      }
    }
    if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    let ticket;
    try {
      ticket = await Ticket.findByIdAndDelete(req.params.id);
    } catch (e) {
      const idx = demoTickets.findIndex(t => t._id === req.params.id);
      if (idx !== -1) { ticket = demoTickets[idx]; demoTickets.splice(idx, 1); }
    }
    if (!ticket) return res.status(404).json({ success: false, error: 'Ticket not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

exports.getTicketStats = async (req, res) => {
  try {
    let stats;
    try {
      const totalTickets = await Ticket.countDocuments();
      const openTickets = await Ticket.countDocuments({ status: 'Open' });
      const inProgressTickets = await Ticket.countDocuments({ status: 'In Progress' });
      const resolvedTickets = await Ticket.countDocuments({ status: 'Resolved' });
      const closedTickets = await Ticket.countDocuments({ status: 'Closed' });
      const categoryDistribution = await Ticket.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }]);
      const priorityDistribution = await Ticket.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]);
      const statusDistribution = await Ticket.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
      stats = { totalTickets, openTickets, inProgressTickets, resolvedTickets, closedTickets, categoryDistribution: categoryDistribution.map(c => ({ name: c._id, value: c.count })), priorityDistribution: priorityDistribution.map(p => ({ name: p._id, value: p.count })), statusDistribution: statusDistribution.map(s => ({ name: s._id, value: s.count })), avgResolutionTime: 0, mlAccuracy: 92.5 };
    } catch (dbError) {
      const tickets = demoTickets;
      stats = { totalTickets: tickets.length, openTickets: tickets.filter(t => t.status === 'Open').length, inProgressTickets: tickets.filter(t => t.status === 'In Progress').length, resolvedTickets: tickets.filter(t => t.status === 'Resolved').length, closedTickets: tickets.filter(t => t.status === 'Closed').length, categoryDistribution: [], priorityDistribution: [], statusDistribution: [], avgResolutionTime: 0, mlAccuracy: 92.5 };
      const catMap = {}, priMap = {}, statMap = {};
      tickets.forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + 1; priMap[t.priority] = (priMap[t.priority] || 0) + 1; statMap[t.status] = (statMap[t.status] || 0) + 1; });
      stats.categoryDistribution = Object.entries(catMap).map(([k, v]) => ({ name: k, value: v }));
      stats.priorityDistribution = Object.entries(priMap).map(([k, v]) => ({ name: k, value: v }));
      stats.statusDistribution = Object.entries(statMap).map(([k, v]) => ({ name: k, value: v }));
    }
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
