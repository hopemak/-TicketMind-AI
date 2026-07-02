const Ticket = require('../models/Ticket');

exports.getDashboardStats = async (req, res) => {
  try {
    const matchStage = req.user.role === 'admin' ? {} : { createdBy: req.user._id };

    const [
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      closedTickets,
      categoryDistribution,
      priorityDistribution,
      statusDistribution,
      monthlyTickets
    ] = await Promise.all([
      Ticket.countDocuments(matchStage),
      Ticket.countDocuments({ ...matchStage, status: 'Open' }),
      Ticket.countDocuments({ ...matchStage, status: 'In Progress' }),
      Ticket.countDocuments({ ...matchStage, status: 'Resolved' }),
      Ticket.countDocuments({ ...matchStage, status: 'Closed' }),
      Ticket.aggregate([
        { $match: matchStage },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Ticket.aggregate([
        { $match: matchStage },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Ticket.aggregate([
        { $match: matchStage },
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Ticket.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalTickets,
        openTickets,
        inProgressTickets,
        resolvedTickets,
        closedTickets,
        categoryDistribution: categoryDistribution.map(c => ({ name: c._id, value: c.count })),
        priorityDistribution: priorityDistribution.map(p => ({ name: p._id, value: p.count })),
        statusDistribution: statusDistribution.map(s => ({ name: s._id, value: s.count })),
        monthlyTickets: monthlyTickets.map(m => ({
          month: `${m._id.year}-${String(m._id.month).padStart(2, '0')}`,
          count: m.count
        }))
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

exports.getRecentTickets = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const matchStage = req.user.role === 'admin' ? {} : { createdBy: req.user._id };

    const tickets = await Ticket.find(matchStage)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      data: tickets
    });
  } catch (error) {
    console.error('Recent tickets error:', error);
    res.status(500).json({ error: 'Failed to fetch recent tickets' });
  }
};
