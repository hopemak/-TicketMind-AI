const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters']
    },
    category: {
      type: String,
      enum: [
        'Technical Issue', 'Billing', 'Refund', 'Account Access',
        'Feature Request', 'Complaint', 'General Inquiry',
        'Bug Report', 'Shipping', 'Security'
      ],
      required: true,
      index: true
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open',
      index: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolution: {
      type: String,
      trim: true,
      default: ''
    },
    tags: [{
      type: String,
      trim: true
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound indexes for analytics
ticketSchema.index({ category: 1, createdAt: -1 });
ticketSchema.index({ priority: 1, createdAt: -1 });
ticketSchema.index({ status: 1, createdAt: -1 });
ticketSchema.index({ createdBy: 1, status: 1 });

// Generate ticket ID before saving
ticketSchema.pre('save', async function (next) {
  if (!this.ticketId) {
    const count = await mongoose.model('Ticket').countDocuments();
    this.ticketId = `TKT-${100000 + count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);
