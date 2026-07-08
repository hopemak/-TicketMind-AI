const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  aiMetadata: {
    confidenceScore: { type: Number, default: 0.0 },
    categoryProbabilities: [
      {
        category: String,
        probability: Number
      }
    ],
    autoPrioritized: { type: Boolean, default: false },
    keywords: [{ type: String }],
    suggestedReply: { type: String, default: "" },
    isDuplicate: { type: Boolean, default: false },
    similarTicketId: { type: String, default: null },
    wasCorrected: { type: Boolean, default: false },
    originalAiCategory: { type: String, default: null },
    correctedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    sentimentScore: { type: Number, default: 1.0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
