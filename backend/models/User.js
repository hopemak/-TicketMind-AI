const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Customer', 'Agent', 'Admin'], default: 'Customer' },
  specialties: [{ type: String }], // e.g., ["Technical Issue", "Security"]
  activeTicketCount: { type: Number, default: 0 },
  maxCapacity: { type: Number, default: 5 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
